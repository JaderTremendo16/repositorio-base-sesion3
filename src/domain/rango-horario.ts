import { RangoInvalidoError } from "./errores";

export class RangoHorario {
  readonly inicio: Date;
  readonly fin: Date;

  private constructor(inicio: Date, fin: Date) {
    this.inicio = new Date(inicio.getTime());
    this.fin = new Date(fin.getTime());
  }

  static crear(inicio: Date, fin: Date): RangoHorario {
    if (fin.getTime() <= inicio.getTime()) {
      throw new RangoInvalidoError();
    }
    return new RangoHorario(inicio, fin);
  }

  duracionMinutos(): number {
    return Math.round((this.fin.getTime() - this.inicio.getTime()) / (1000 * 60));
  }

  seCruzaCon(otro: RangoHorario): boolean {
    return this.inicio.getTime() < otro.fin.getTime() && otro.inicio.getTime() < this.fin.getTime();
  }

  igualA(otro: RangoHorario): boolean {
    return (
      this.inicio.getTime() === otro.inicio.getTime() &&
      this.fin.getTime() === otro.fin.getTime()
    );
  }
}
