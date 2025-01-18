export interface Transaccion {
  id: number;
  tipoTransaccion: string;
  fecha: Date;
  cantidad: number;
  tipoEstado: string;

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
