import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { Agenda } from "../../domain/agenda";
import { AgendaRepositorio } from "../../domain/agenda-repositorio";
import { Cita, EstadoCita } from "../../domain/cita";
import { RangoHorario } from "../../domain/rango-horario";

interface CitaDto {
  id: string;
  pacienteId: string;
  inicio: string;
  fin: string;
  estado: EstadoCita;
}

type DatosJson = Record<string, CitaDto[]>;

export class AgendaRepositorioJson implements AgendaRepositorio {
  constructor(readonly ruta: string) {}

  async porMedico(medicoId: string): Promise<Agenda> {
    const data = this.leerDatos();
    const citasDto = data[medicoId];
    if (!citasDto) {
      return new Agenda(medicoId);
    }

    const citas = citasDto.map((c) =>
      Cita.reconstruir(
        c.id,
        c.pacienteId,
        RangoHorario.crear(new Date(c.inicio), new Date(c.fin)),
        c.estado,
      ),
    );

    return new Agenda(medicoId, citas);
  }

  async guardar(agenda: Agenda): Promise<void> {
    const data = this.leerDatos();
    data[agenda.medicoId] = agenda.citas().map((c) => ({
      id: c.id,
      pacienteId: c.pacienteId,
      inicio: c.rango.inicio.toISOString(),
      fin: c.rango.fin.toISOString(),
      estado: c.estado,
    }));

    const carpeta = dirname(this.ruta);
    if (!existsSync(carpeta)) {
      mkdirSync(carpeta, { recursive: true });
    }

    writeFileSync(this.ruta, JSON.stringify(data, null, 2), "utf-8");
  }

  private leerDatos(): DatosJson {
    if (!existsSync(this.ruta)) {
      return {};
    }
    try {
      const contenido = readFileSync(this.ruta, "utf-8");
      if (!contenido.trim()) {
        return {};
      }
      return JSON.parse(contenido) as DatosJson;
    } catch {
      return {};
    }
  }
}
