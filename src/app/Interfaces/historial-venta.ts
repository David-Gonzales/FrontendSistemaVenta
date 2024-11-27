import { DetalleVenta } from "./detalle-venta";

export interface HistorialVenta {
  id: number;
  numeroVenta: string;
  tipoVenta: string;
  tipoPago: string;
  total: number;

  // Cliente
  idCliente: number;
  nombreCliente: string;
  apellidosCliente: string;

  // Detalle Venta
  detalleVentas: DetalleVenta[];
}
