export class TransaccionModel {
  TipoTransaccion: string;
  Fecha: Date;
  Cantidad: number;
  TipoEstado: string;
  IdProducto: number;
  IdUsuario: number;

  constructor(
    tipoTransaccion: string,
    fecha: Date,
    cantidad: number,
    tipoEstado: string,
    idProducto: number,
    idUsuario: number
  ){
    this.TipoTransaccion = tipoTransaccion;
    this.Fecha = fecha;
    this.Cantidad = cantidad;
    this.TipoEstado = tipoEstado;
    this.IdProducto = idProducto;
    this.IdUsuario = idUsuario;
  }
}
