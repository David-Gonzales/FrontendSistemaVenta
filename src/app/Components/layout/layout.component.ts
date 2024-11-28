import { Component } from '@angular/core';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  mostrarBienvenida: boolean = true;
  nombreUsuario: string = '';
  rol: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const datosUsuario = JSON.parse(usuario);
      this.nombreUsuario = datosUsuario.nombreCompleto;
      this.rol = datosUsuario.rol;
    } else {
      this.nombreUsuario = 'Invitado';
      this.rol = 'Sin rol';
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['']);
  }
}
