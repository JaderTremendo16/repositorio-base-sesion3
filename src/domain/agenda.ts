import { Cita } from "./cita";
import { CitaNoEncontradaError, CruceDeHorarioError } from "./errores";

export class Agenda {
  private _citas: Cita[];

  constructor(readonly medicoId: string, citasIniciales: Cita[] = []) {
    this._citas = [...citasIniciales];
  }

  citas(): readonly Cita[] {
    return [...this._citas];
  }

  agendar(cita: Cita): void {
    const seCruza = this._citas.some(
      (existente) => existente.activa() && existente.rango.seCruzaCon(cita.rango),
    );
    if (seCruza) {
      throw new CruceDeHorarioError();
    }
    this._citas.push(cita);
  }

  cancelar(citaId: string): void {
    const cita = this._citas.find((c) => c.id === citaId);
    if (!cita) {
      throw new CitaNoEncontradaError();
    }
    cita.cancelar();
  }
}
