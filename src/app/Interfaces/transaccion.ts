export type tipoEstado = "Lleno" | "Vacío";
export type tipoTransaccion = "Ingreso" | "Salida";

export interface Transaccion {
  id: number;
  tipoTransaccion: tipoTransaccion;
  fecha: Date;
  cantidad: number;
  tipoEstado: tipoEstado;

  //Producto
  idProducto: number;
  nombreProducto: string;
  capacidadProducto: number;
  unidadProducto: string;
  stockProductoPrincipal: number;

  //Usuario
  idUsuario: number;
  nombreUsuario: string;
  apellidoUsuario: string;
}
