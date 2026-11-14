import { AgendaRepositorio } from "../domain/agenda-repositorio";
import { EventBus } from "./puertos";

export interface ComandoCancelarCita {
  medicoId: string;
  citaId: string;
}

export class CancelarCita {
  constructor(
    private readonly agendas: AgendaRepositorio,
    private readonly eventos: EventBus,
  ) {}

  async ejecutar(cmd: ComandoCancelarCita): Promise<void> {
    const agenda = await this.agendas.porMedico(cmd.medicoId);
    agenda.cancelar(cmd.citaId);
    await this.agendas.guardar(agenda);
    await this.eventos.emit("cita.cancelada", { citaId: cmd.citaId, medicoId: cmd.medicoId });
  }
}
