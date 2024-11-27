export class UsuarioUpdateModel {
  Id: number;
  Nombres: string;
  Apellidos: string;
  Telefono: string;
  Correo: string;
  Clave: string;
  EsActivo: boolean;
  IdRol: number;

  constructor(
    id: number,
    nombres: string,
    apellidos: string,
    telefono: string,
    correo: string,
    clave: string,
    esActivo: boolean,
    idRol: number
  ){
    this.Id = id;
    this.Nombres = nombres;
    this.Apellidos = apellidos;
    this.Telefono = telefono;
    this.Correo = correo;
    this.Clave = clave;
    this.EsActivo = esActivo;
    this.IdRol = idRol;
  }
}
