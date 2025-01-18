export class ProductoUpdateModel {
  Id: number;
  Nombre: string;
  Capacidad: number;
  Unidad: string;
  Precio: number;
  EsActivo: boolean;

  constructor(
    id: number,
    nombre: string,
    capacidad: number,
    unidad: string,
    precio: number,
    esActivo: boolean
  ){
    this.Id = id;
    this.Nombre = nombre;
    this.Capacidad = capacidad;
    this.Unidad = unidad;
    this.Precio = precio;
    this.EsActivo = esActivo;
  }
}
