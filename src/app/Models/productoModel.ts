export class ProductoModel {
  Nombre: string;
  Capacidad: number;
  Unidad: string;
  Precio: number;
  EsActivo: boolean;

  constructor(
    nombre: string,
    capacidad: number,
    unidad: string,
    precio: number,
    esActivo: boolean
  ){
    this.Nombre = nombre;
    this.Capacidad = capacidad;
    this.Unidad = unidad;
    this.Precio = precio;
    this.EsActivo = esActivo;
  }
}
