export type tipoEstado = "Lleno" | "Vacío";

export class DetalleVentaModel {
  IdProducto: number;
  Cantidad: number;
  TipoEstado: tipoEstado;
  PrecioUnitario: number;
  Total: number;

  constructor(
    idProducto: number,
    cantidad: number,
    tipoEstado: tipoEstado,
    precioUnitario: number,
    total: number

  ){
    this.IdProducto = idProducto;
    this.Cantidad = cantidad;
    this.TipoEstado = tipoEstado;
    this.PrecioUnitario = precioUnitario;
    this.Total = total;
  }
}
