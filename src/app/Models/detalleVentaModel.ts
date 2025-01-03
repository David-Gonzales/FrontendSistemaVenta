export class DetalleVentaModel {
  IdProducto: number;
  Cantidad: number;
  TipoEstado: string;
  TipoVenta: string;
  PrecioUnitario: number;
  Total: number;

  constructor(
    idProducto: number,
    cantidad: number,
    tipoEstado: string,
    tipoVenta: string,
    precioUnitario: number,
    total: number

  ){
    this.IdProducto = idProducto;
    this.Cantidad = cantidad;
    this.TipoEstado = tipoEstado;
    this.TipoVenta = tipoVenta;
    this.PrecioUnitario = precioUnitario;
    this.Total = total;
  }
}
