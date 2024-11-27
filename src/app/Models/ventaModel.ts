import { DetalleVentaModel } from "./detalleVentaModel";

export class VentaModel {
  NumeroVenta: string;
  TipoVenta: string;
  TipoPago: string;
  DetalleVenta: DetalleVentaModel;
  IdCliente: number;
  IdUsuario: number;

  constructor(
    numeroVenta: string,
    tipoVenta: string,
    tipoPago: string,
    detalleVenta: DetalleVentaModel,
    idCliente: number,
    idUsuario: number,
  ){
    this.NumeroVenta = numeroVenta;
    this.TipoPago = tipoPago;
    this.TipoVenta = tipoVenta;
    this.DetalleVenta = detalleVenta;
    this.IdCliente = idCliente;
    this.IdUsuario = idUsuario;
  }
}
