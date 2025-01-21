import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { Chart, registerables } from 'chart.js';
import { DashBoardService } from '../../../../Services/dash-board.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent implements OnInit{

  totalIngresos: string = "0";
  totalVentas: string = "0";
  totalProductos: string = "";

  constructor(
    private _dashboardServicio: DashBoardService
  ){}

  mostrarGrafico(labelGrafico:any[], dataGrafico: any[]){
    const chartBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets:[{
          label: '# de Ventas',
          data: dataGrafico,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this._dashboardServicio.resumen().subscribe({
      next: (respuesta) => {
        if(respuesta.succeeded){
          this.totalIngresos = respuesta.data.totalIngresos.toString();
          this.totalVentas = respuesta.data.totalVentas.toString();
          this.totalProductos = respuesta.data.totalProductos.toString();

          const arrayData: any[] = respuesta.data.ventasUltimaSemana;
          console.log(arrayData);

          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);
          console.log(labelTemp, dataTemp);
          this.mostrarGrafico(labelTemp, dataTemp);
        }
      },
      error: () => {}
    });
  }

}
