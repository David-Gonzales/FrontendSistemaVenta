export class ProductoModel {
  Nombre: string;
  Capacidad: number;
  Unidad: string;
  Stock: number;
  Precio: number;
  EsActivo: boolean;

  constructor(
    nombre: string,
    capacidad: number,
    unidad: string,
    stock: number,
    precio: number,
    esActivo: boolean
  ){
    this.Nombre = nombre;
    this.Capacidad = capacidad;
    this.Unidad = unidad;
    this.Stock = stock;
    this.Precio = precio;
    this.EsActivo = esActivo;
  }
}
