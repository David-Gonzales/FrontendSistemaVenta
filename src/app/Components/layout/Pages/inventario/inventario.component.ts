import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {
  constructor(private router: Router) {}

  goToEntrada() {
    this.router.navigate(['inventario/entrada']);
  }

  goToSalida() {
    this.router.navigate(['inventario/salida']);
  }
}
