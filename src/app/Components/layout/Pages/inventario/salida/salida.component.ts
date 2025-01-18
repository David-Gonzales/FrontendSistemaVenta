import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../../Reutilizable/shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Transaccion } from '../../../../../Interfaces/transaccion';

import { UtilidadService } from '../../../../../Reutilizable/utilidad.service';
import { TransaccionService } from '../../../../../Services/transaccion.service';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { ModalTransaccionComponent } from '../../../Modales/modal-transaccion/modal-transaccion.component';


@Component({
  selector: 'app-salida',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './salida.component.html',
  styleUrl: './salida.component.css'
})
export class SalidaComponent {

  columnasTabla: string[] = ['usuario', 'horaSalida', 'fechaSalida', 'cantidad', 'producto', 'estado', 'acciones'];

  listaTransacciones: Transaccion[] = [];
  dataListaTransacciones: MatTableDataSource<Transaccion> = new MatTableDataSource(this.listaTransacciones);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _transaccionServicio: TransaccionService,
    private _utilidadServicio: UtilidadService
  ) { }

  obtenerSalidas() {
    this._transaccionServicio.listar().subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data)) {
            const transaccionesIngreso = respuesta.data.filter(transaccion => transaccion.tipoTransaccion === 'Salida');
            if (transaccionesIngreso.length > 0) {
              this.dataListaTransacciones.data = transaccionesIngreso;
            } else {
              this._utilidadServicio.mostrarAlerta("No se encontraron transacciones de tipo 'Salida'", "Opps!");
            }
          }
          else {
            console.error("La propiedad 'data' no es un arreglo de transacciones.");
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Opps!");
          }
        }
        else this._utilidadServicio.mostrarAlerta("Error al obtener los clientes", "Opps!");
      },
      error: (e) => { }
    });
  }

  ngOnInit(): void {
    this.obtenerSalidas();
  }

  ngAfterViewInit(): void {
    this.dataListaTransacciones.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaTransacciones.filter = filterValue.trim().toLocaleLowerCase();
  }

  agregarSalida() {
    this.dialog.open(ModalTransaccionComponent, {
      disableClose: true
    }).afterClosed().subscribe({
      next: (resultado) => {
        if (resultado === "true") this.obtenerSalidas();
      },
      error: (error) => { }
    });
  }

  editarSalida(transaccion:Transaccion){
      this.dialog.open(ModalTransaccionComponent, {
        disableClose:true,
        data: transaccion

      }).afterClosed().subscribe(resultado => {
        if(resultado === "true") this.obtenerSalidas();
      });
    }

  eliminarSalida(transaccion: Transaccion) {
    let texto: string = "";
    if (transaccion.cantidad == 1) {
      texto = "Esta transacción revertirá " + transaccion.cantidad + " producto ingresado";
    } else if (transaccion.cantidad > 1) {
      texto = "Esta transacción revertirá " + transaccion.cantidad + " productos ingresados";
    }
    Swal.fire({
      title: "¿Desea eliminar esta transacción?",
      text: texto,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, volver"
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._transaccionServicio.eliminar(transaccion.id).subscribe({
          next: (respuesta) => {
            if (respuesta.succeeded) {
              this._utilidadServicio.mostrarAlerta("La transacción ha sido eliminada", "Listo!");
              this.obtenerSalidas();
            }
            else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar esta transacción", "Error");
            }
          },
          error: (e) => { }
        });
      }
    });
  }
}
