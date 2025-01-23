import { Component } from '@angular/core';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { Router } from '@angular/router';
import { Menu } from '../../Interfaces/menu';
import { UtilidadService } from '../../Reutilizable/utilidad.service';
import { MenuService } from '../../Services/menu.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  listaMenus: Menu[] = [];
  nombreUsuario: string = '';
  rol: string = '';

  constructor(
    private router: Router,
    private _menuServicio: MenuService,
    private _utilidadServicio: UtilidadService
  ){}

  ngOnInit(): void {
    const usuario = this._utilidadServicio.obtenerSesionUsuario();
    console.log(usuario);
    if (usuario!= null) {

      this.nombreUsuario = usuario.nombreCompleto;
      this.rol = usuario.rol;

    } else {
      this.nombreUsuario = 'Invitado';
      this.rol = 'Sin rol';
    }

    this._menuServicio.listarMenusPorUsuario(usuario.idUsuario).subscribe({
      next: (respuesta)=> {
        if(respuesta.succeeded){
          if (Array.isArray(respuesta.data)) {
            this.listaMenus = respuesta.data.map(menu => {
              if (menu.submenus && menu.submenus.length > 0) {
                // Si tiene submenús, agregamos 'showSubMenu' con valor inicial false (oculto)
                menu.showSubMenu = false;
              }
              return menu;
            });
          } else {
            console.error("La propiedad 'data' no es un arreglo de Clientes.");
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Opps!");
          }
        }
        else this._utilidadServicio.mostrarAlerta("Error al obtener los menús", "Opps!");
      }
    });
  }

  toggleSubMenu(menu: Menu): void {
    // Si el menú tiene submenús, mostramos u ocultamos el submenú
    if (menu.submenus && menu.submenus.length > 0) {
      menu.showSubMenu = !menu.showSubMenu;
    }

    this.listaMenus.forEach(m => {
      if (m !== menu) {
        m.showSubMenu = false;
      }
    });
  }

  cerrarSesion(): void {
    this._utilidadServicio.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }

  // isInventarioOpen = false;
  // activeSubItem = '';

  // toggleInventario() {
  //   this.isInventarioOpen = !this.isInventarioOpen;
  // }

  // selectSubItem(item: 'entrada' | 'salida') {
  //   this.activeSubItem = item;
  // }

  // resetActiveSubItem() {
  //   this.activeSubItem = '';
  //   this.isInventarioOpen = false;
  // }
}
