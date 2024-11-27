export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  ciudad: string;
  telefono: string;
  fechaNacimiento: Date;
  esActivo: boolean;
  edad: number;
}
