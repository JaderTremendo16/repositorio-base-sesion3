import { AgendaRepositorio } from "../domain/agenda-repositorio";
import { Cita } from "../domain/cita";
import { RangoHorario } from "../domain/rango-horario";
import { EventBus, GeneradorId } from "./puertos";

export interface ComandoAgendarCita {
  medicoId: string;
  pacienteId: string;
  inicio: Date;
  fin: Date;
}

export class AgendarCita {
  constructor(
    private readonly agendas: AgendaRepositorio,
    private readonly eventos: EventBus,
    private readonly generadorId: GeneradorId,
  ) {}

  async ejecutar(cmd: ComandoAgendarCita): Promise<string> {
    const rango = RangoHorario.crear(cmd.inicio, cmd.fin);
    const agenda = await this.agendas.porMedico(cmd.medicoId);
    const id = this.generadorId.nuevo();
    const cita = Cita.nueva(id, cmd.pacienteId, rango);

    agenda.agendar(cita);
    await this.agendas.guardar(agenda);
    await this.eventos.emit("cita.confirmada", { citaId: id, medicoId: cmd.medicoId });

    return id;
  }
}
