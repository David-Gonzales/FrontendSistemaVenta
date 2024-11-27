export class ClienteModel {
  Nombres: string;
  Apellidos: string;
  TipoDocumento: string;
  NumeroDocumento: string;
  Correo: string;
  Ciudad: string;
  Telefono: string;
  FechaNacimiento: Date;
  EsActivo: boolean;

  constructor(
    nombres: string,
    apellidos: string,
    tipoDocumento: string,
    numeroDocumento: string,
    correo: string,
    ciudad: string,
    telefono: string,
    fechaNacimiento: Date,
    esActivo: boolean
  ) {
    this.Nombres = nombres;
    this.Apellidos = apellidos;
    this.TipoDocumento = tipoDocumento;
    this.NumeroDocumento = numeroDocumento;
    this.Correo = correo;
    this.Ciudad = ciudad;
    this.Telefono = telefono;
    this.FechaNacimiento = fechaNacimiento;
    this.EsActivo = esActivo;
  }
}
