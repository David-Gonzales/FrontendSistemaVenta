import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../Interfaces/sesion';
import { Menu } from '../Interfaces/menu';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackBar:MatSnackBar) { }

  mostrarAlerta(mensaje:string, tipo:string){
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    });
  }

  guardarSesionUsuario(usuarioSesion:Sesion){
    localStorage.setItem("usuario", JSON.stringify(usuarioSesion));
  }

  guardarSesionMenu(menuSesion: Menu){
    localStorage.setItem("menu", JSON.stringify(menuSesion));
  }

  obtenerSesionMenu(){
    const dataCadena = localStorage.getItem("menu");
    const menu = JSON.parse(dataCadena!) as Menu[];
    return menu;
  }

  obtenerSesionUsuario(){
    const dataCadena = localStorage.getItem("usuario");

    const usuario = JSON.parse(dataCadena!);
    return usuario;
  }

  eliminarSesionUsuario(){
    localStorage.removeItem("usuario");
    localStorage.removeItem("menu");
  }
}
