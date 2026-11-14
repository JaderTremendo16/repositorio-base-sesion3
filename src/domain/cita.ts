import { CitaYaCanceladaError } from "./errores";
import { RangoHorario } from "./rango-horario";

export type EstadoCita = "confirmada" | "cancelada";

export class Cita {
  private constructor(
    readonly id: string,
    readonly pacienteId: string,
    readonly rango: RangoHorario,
    private _estado: EstadoCita,
  ) {}

  static nueva(id: string, pacienteId: string, rango: RangoHorario): Cita {
    return new Cita(id, pacienteId, rango, "confirmada");
  }

  static reconstruir(id: string, pacienteId: string, rango: RangoHorario, estado: EstadoCita): Cita {
    return new Cita(id, pacienteId, rango, estado);
  }

  get estado(): EstadoCita {
    return this._estado;
  }

  activa(): boolean {
    return this._estado === "confirmada";
  }

  cancelar(): void {
    if (this._estado === "cancelada") {
      throw new CitaYaCanceladaError();
    }
    this._estado = "cancelada";
  }
}
