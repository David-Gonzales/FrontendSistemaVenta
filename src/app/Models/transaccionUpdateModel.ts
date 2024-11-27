export type tipoEstado = "Lleno" | "Vacío";
export type tipoTransaccion = "Ingreso" | "Salida";

export class TransaccionUpdateModel {
  Id: number;
  TipoTransaccion: tipoTransaccion;
  Fecha: Date;
  Cantidad: number;
  TipoEstado: tipoEstado;
  IdProducto: number;
  IdUsuario: number;

  constructor(
    id: number,
    tipoTransaccion: tipoTransaccion,
    fecha: Date,
    cantidad: number,
    tipoEstado: tipoEstado,
    idProducto: number,
    idUsuario: number
  ){
    this.Id = id;
    this.TipoTransaccion = tipoTransaccion;
    this.Fecha = fecha;
    this.Cantidad = cantidad;
    this.TipoEstado = tipoEstado;
    this.IdProducto = idProducto;
    this.IdUsuario = idUsuario;
  }
}
