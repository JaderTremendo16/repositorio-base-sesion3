import { Agenda } from "../../domain/agenda";
import { AgendaRepositorio } from "../../domain/agenda-repositorio";
import { Cita } from "../../domain/cita";

export class AgendaRepositorioMemoria implements AgendaRepositorio {
  private readonly datos = new Map<string, Agenda>();

  async porMedico(medicoId: string): Promise<Agenda> {
    const agenda = this.datos.get(medicoId);
    if (!agenda) {
      return new Agenda(medicoId);
    }
    return this.clonar(agenda);
  }

  async guardar(agenda: Agenda): Promise<void> {
    this.datos.set(agenda.medicoId, this.clonar(agenda));
  }

  private clonar(agenda: Agenda): Agenda {
    return new Agenda(
      agenda.medicoId,
      agenda.citas().map((c) => Cita.reconstruir(c.id, c.pacienteId, c.rango, c.estado)),
    );
  }
}
