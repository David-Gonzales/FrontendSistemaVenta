import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { HistorialVenta } from '../../../../Interfaces/historial-venta';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { ModalHistorialVentasComponent } from '../../Modales/modal-historial-ventas/modal-historial-ventas.component';

@Component({
  selector: 'app-historial-venta',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './historial-venta.component.html',
  styleUrl: './historial-venta.component.css'
})
export class HistorialVentaComponent implements AfterViewInit{

  columnasTabla:string[] = ['fechaRegistro', 'horaRegistro', 'numeroVenta', 'tipoPago', 'cliente', 'total', 'accion'];
  dataInicio:HistorialVenta[]=[];
  dataListaHistorialVentas: MatTableDataSource<HistorialVenta> = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerHistorialVentas(){
    this._ventaServicio.listar().subscribe({
      next:(respuesta) => {
        if(respuesta.succeeded){
          if (Array.isArray(respuesta.data)) {
            this.dataListaHistorialVentas.data = respuesta.data;
          }else {
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Opps!");
          }
        }
      },
      error:(e)=>{}
    });
  }

  ngOnInit(): void {
    this.obtenerHistorialVentas();
  }

  ngAfterViewInit(): void {
    this.dataListaHistorialVentas.paginator = this.paginacionTabla;
  }

  verDetalleVenta(historialVenta: HistorialVenta){
    this.dialog.open(ModalHistorialVentasComponent, {
      disableClose:true,
      data: historialVenta

    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerHistorialVentas();
    });
  }
}
