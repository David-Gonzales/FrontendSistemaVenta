import { Component, Inject, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HistorialVenta } from '../../../../Interfaces/historial-venta';
import { VentaService } from '../../../../Services/venta.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-modal-historial-ventas',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './modal-historial-ventas.component.html',
  styleUrl: './modal-historial-ventas.component.css'
})
export class ModalHistorialVentasComponent {
  columnasTabla: string[] = ['producto', 'cantidad', 'estado', 'precioUnitario', 'total']
  dataInicio: DetalleVenta[] = [];
  dataListaDetalleVenta: MatTableDataSource<DetalleVenta> = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  detallesVenta:any;
  fechaRegistro:string = '';
  numeroVenta:string = '';
  tipoPago:string='';
  total:number=0;

  constructor(
    private modalActual: MatDialogRef<ModalHistorialVentasComponent>,
    @Inject(MAT_DIALOG_DATA) public datosHistorialVentas: HistorialVenta,
    private _ventaServicio: VentaService,
  ) { }

  obtenerDetalleHistorialVenta(idVenta: number) {
    this._ventaServicio.listar().subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data)) {
            const ventaSeleccionada = respuesta.data.find(venta => venta.id === idVenta);

            this.fechaRegistro = ventaSeleccionada.fechaRegistro.toString();
            this.numeroVenta = ventaSeleccionada.numeroVenta;
            this.tipoPago = ventaSeleccionada.tipoPago;
            this.total = ventaSeleccionada.total;

            if (ventaSeleccionada) {
              this.dataListaDetalleVenta.data = ventaSeleccionada.detalleVentas;

            } else {
              console.warn(`No se encontró la venta con id: ${idVenta}`);
              this.dataListaDetalleVenta.data = []; // Limpia en caso de que no se encuentre
            }
          }
        }
      },
      error: (e) => { }
    });
  }

  ngOnInit(): void{
    if (!this.datosHistorialVentas || !this.datosHistorialVentas.id) {
      console.error('Datos inválidos recibidos en el modal.');
      this.modalActual.close();
      return;
    }
    this.obtenerDetalleHistorialVenta(this.datosHistorialVentas.id);
  }

  ngAfterViewInit(): void {
    this.dataListaDetalleVenta.paginator = this.paginacionTabla;
  }
}
