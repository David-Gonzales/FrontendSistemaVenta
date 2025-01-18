import { EstadoProducto } from "./estadoProducto";

export interface Producto {
  id: number;
  nombre: string;
  capacidad: number;
  unidad: string;
  precio: number;
  esActivo: boolean;
  stockGeneral: number;
  //estados: EstadoProducto[];  // Esta propiedad representa la lista de estados
}
