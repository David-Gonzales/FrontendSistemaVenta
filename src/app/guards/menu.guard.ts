import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilidadService } from '../Reutilizable/utilidad.service';

@Injectable({
  providedIn: 'root'
})
export class MenuGuard implements CanActivate {

  constructor(private router: Router,
    private _utilidadServicio: UtilidadService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const rutas = this._utilidadServicio.obtenerSesionMenu();

    if (!rutas) {
      this.router.navigate(['pages/dashboard']);
      return false;
    }

    let rutaActual = route.routeConfig?.path as string;
    rutaActual = "/pages/" + rutaActual;
    console.log("RUTA ACTUAL", rutaActual);

    if (!rutaActual) {
      this.router.navigate(['pages/dashboard']);
      return false;
    }

    let flag = false;

    for (const item of rutas) {
      if (item.url?.toUpperCase() === rutaActual.toUpperCase()) {
        flag = true;
        break;
      }
console.log("URL: ",item.url);
      if (item.submenus && Array.isArray(item.submenus)) {
        for (const subItem of item.submenus) {
          if (subItem.url?.toUpperCase() === rutaActual.toUpperCase()) {
            flag = true;
            break;
          }
        }
      }

      if (flag) break;
    }

    if (flag) {
      return true;
    } else {
      this.router.navigate(['pages/dashboard']);
      return false;
    }
  }
}
