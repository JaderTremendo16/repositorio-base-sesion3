import { AgendarCita } from "./application/agendar-cita";
import { CancelarCita } from "./application/cancelar-cita";
import { EventBus, GeneradorId } from "./application/puertos";
import { AgendaRepositorio } from "./domain/agenda-repositorio";
import { CruceDeHorarioError, RangoInvalidoError } from "./domain/errores";
import { AgendaRepositorioJson } from "./infrastructure/persistence/agenda-repositorio-json";
import { AgendaRepositorioMemoria } from "./infrastructure/persistence/agenda-repositorio-memoria";

export type Persistencia =
  | { tipo: "memoria" }
  | { tipo: "json"; ruta: string };

class GeneradorIdSecuencial implements GeneradorId {
  private n = 0;
  nuevo(): string {
    this.n += 1;
    return `cita-${this.n}`;
  }
}

class EventBusEnMemoria implements EventBus {
  readonly emitidos: Array<{ nombre: string; datos: Record<string, unknown> }> = [];
  async emit(nombre: string, datos: Record<string, unknown>): Promise<void> {
    this.emitidos.push({ nombre, datos });
  }
}

export function crearApp(persistencia: Persistencia) {
  const agendas: AgendaRepositorio =
    persistencia.tipo === "memoria"
      ? new AgendaRepositorioMemoria()
      : new AgendaRepositorioJson(persistencia.ruta);

  const eventos = new EventBusEnMemoria();
  const generadorId = new GeneradorIdSecuencial();

  const agendar = new AgendarCita(agendas, eventos, generadorId);
  const cancelar = new CancelarCita(agendas, eventos);

  const controller = {
    async post(body: Record<string, unknown>): Promise<{ status: number; body?: unknown; error?: string }> {
      if (
        !body ||
        typeof body.medicoId !== "string" ||
        typeof body.pacienteId !== "string" ||
        typeof body.inicio !== "string" ||
        typeof body.fin !== "string"
      ) {
        return { status: 400, error: "Datos incompletos o inválidos" };
      }

      const inicio = new Date(body.inicio);
      const fin = new Date(body.fin);

      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        return { status: 400, error: "Formato de fecha inválido" };
      }

      try {
        const id = await agendar.ejecutar({
          medicoId: body.medicoId,
          pacienteId: body.pacienteId,
          inicio,
          fin,
        });
        return { status: 201, body: { id } };
      } catch (error) {
        if (error instanceof CruceDeHorarioError) {
          return { status: 409, error: error.message };
        }
        if (error instanceof RangoInvalidoError) {
          return { status: 400, error: error.message };
        }
        return { status: 500, error: "Error interno no controlado" };
      }
    },
  };

  return {
    agendas,
    eventos,
    generadorId,
    casos: { agendar, cancelar },
    controller,
  };
}
