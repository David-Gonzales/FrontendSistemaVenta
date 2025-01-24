import { UtilidadService } from './../Reutilizable/utilidad.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidarLoginGuard implements CanActivate {
  constructor(private router: Router,
    private _utilidadServicio: UtilidadService
  ){}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let user = this._utilidadServicio.obtenerSesionUsuario();
    if (user) {
      this.router.navigate(['pages']);
      return false;
    }
    else {
      return true;
    }
  }
}
