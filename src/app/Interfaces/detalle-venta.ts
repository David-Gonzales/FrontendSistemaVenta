export type tipoEstado = "Lleno" | "Vacío";

export interface DetalleVenta {
  id: number;
  cantidad: number;
  tipoEstado: tipoEstado;
  precioUnitario: number;
  total: number;

  idProducto: number;
  nombreProducto: string;
  capacidadProducto: number;
  unidadProducto: string;
}
