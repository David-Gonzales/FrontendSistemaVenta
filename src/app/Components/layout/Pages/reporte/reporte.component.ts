import { Component, OnInit, } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { Reporte1Component } from "../../../Reportes/reporte1/reporte1.component";

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [SharedModule, Reporte1Component],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css',

})
export class ReporteComponent implements OnInit {

  selectedReporte: string = ''; // Almacena el reporte seleccionado

  // Método para manejar el cambio en el menú desplegable
  onReporteChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedReporte = selectElement.value;
  }

  ngOnInit(): void {

  }

}
