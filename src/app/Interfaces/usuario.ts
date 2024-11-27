export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  clave: string;
  esActivo: boolean;
  idRol: number;
  nombreRol: string;
}
