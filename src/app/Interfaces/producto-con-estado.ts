import { EstadoProductoSimple } from './estado-producto-simple';

export interface ProductoConEstado {
  id: number;
  nombre: string;
  estados: EstadoProductoSimple[];
}
