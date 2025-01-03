import { DetalleVentaModel } from "./detalleVentaModel";

export class VentaModel {
  TipoPago: string;
  DetalleVentas: DetalleVentaModel[];
  IdCliente: number;
  IdUsuario: number;

  constructor(
    tipoPago: string,
    detalleVentas: DetalleVentaModel[],
    idCliente: number,
    idUsuario: number,
  ){
    this.TipoPago = tipoPago;
    this.DetalleVentas = detalleVentas;
    this.IdCliente = idCliente;
    this.IdUsuario = idUsuario;
  }
}
