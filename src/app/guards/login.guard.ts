import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilidadService } from '../Reutilizable/utilidad.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router,
    private _utilidadServicio: UtilidadService
  ){}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let user = this._utilidadServicio.obtenerSesionUsuario();
    if (user) {
      return true;
    }
    else {
      this.router.navigate(['login']);
      return false;
    }
  }

}
