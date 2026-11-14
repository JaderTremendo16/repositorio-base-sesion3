export class RangoInvalidoError extends Error {
  constructor(mensaje: string = "El fin del rango debe ser posterior al inicio") {
    super(mensaje);
    this.name = "RangoInvalidoError";
  }
}

export class CruceDeHorarioError extends Error {
  constructor(mensaje: string = "El horario se cruza con otra cita activa") {
    super(mensaje);
    this.name = "CruceDeHorarioError";
  }
}

export class CitaYaCanceladaError extends Error {
  constructor(mensaje: string = "La cita ya se encuentra cancelada") {
    super(mensaje);
    this.name = "CitaYaCanceladaError";
  }
}

export class CitaNoEncontradaError extends Error {
  constructor(mensaje: string = "La cita no fue encontrada en la agenda") {
    super(mensaje);
    this.name = "CitaNoEncontradaError";
  }
}
