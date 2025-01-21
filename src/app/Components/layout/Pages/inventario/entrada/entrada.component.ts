import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../../Reutilizable/shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Transaccion } from '../../../../../Interfaces/transaccion';

import { UtilidadService } from '../../../../../Reutilizable/utilidad.service';
import { TransaccionService } from '../../../../../Services/transaccion.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { ModalTransaccionComponent } from '../../../Modales/modal-transaccion/modal-transaccion.component';

import { ProductoConEstado } from '../../../../../Interfaces/producto-con-estado';
import { ProductoService } from '../../../../../Services/producto.service';

@Component({
  selector: 'app-entrada',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './entrada.component.html',
  styleUrl: './entrada.component.css'
})
export class EntradaComponent implements AfterViewInit {

  totalRegistros: number = 0; // Total de registros en el backend
  pageSize: number = 10; // Tamaño de página inicial
  pageIndex: number = 0; // Página actual

  productosConEstados: ProductoConEstado[] = [];

  mostrarAccordion = false;

  columnasTabla: string[] = ['usuario', 'horaIngreso', 'fechaIngreso', 'cantidad', 'producto', 'estado', 'acciones'];

  listaTransacciones: Transaccion[] = [];
  dataListaTransacciones: MatTableDataSource<Transaccion> = new MatTableDataSource(this.listaTransacciones);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _transaccionServicio: TransaccionService,
    private _utilidadServicio: UtilidadService,
    private _productoServicio: ProductoService
  ) { }

  obtenerEntradas() {
    const pageNumber = this.pageIndex + 1;
    const tipoTransaccion = 'Ingreso';
    this._transaccionServicio.listar(pageNumber, this.pageSize, tipoTransaccion).subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data)) {
            this.totalRegistros = respuesta.totalCount;
            // Actualizar el estado del paginador manualmente
            if (this.paginacionTabla) {
              this.paginacionTabla.length = this.totalRegistros;
              this.paginacionTabla.pageIndex = this.pageIndex;
            }
            this.dataListaTransacciones.data = respuesta.data;

          }
          else {
            console.error("La propiedad 'data' no es un arreglo de transacciones.");
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Opps!");
          }
        }
        else this._utilidadServicio.mostrarAlerta("Error al obtener los clientes", "Opps!");
      },
      error: (e) => {
        console.error("Error en la petición:", e);
        this._utilidadServicio.mostrarAlerta("Error en la conexión", "Opps!");
      }
    });
  }

  cambiarPagina(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    //this.obtenerEntradas();
  }

  obtenerStockProductos() {
    this._productoServicio.listarProductosEstados().subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data)) {
            this.productosConEstados = respuesta.data;
          }
          else {
            console.error("Los datos recibidos no son un array:", respuesta.data);
          }
        }
        else {
          console.error("La respuesta del servicio no fue exitosa:", respuesta);
        }
      },
      error: (e) => { console.error("Error al obtener los productos con estados:", e); }
    });
  }

  toggleAccordion() {
    this.mostrarAccordion = !this.mostrarAccordion;
  }

  ngOnInit(): void {
    this.obtenerEntradas();
    this.obtenerStockProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaTransacciones.paginator = this.paginacionTabla;
    this.paginacionTabla.page.subscribe((event: PageEvent) => {
      this.cambiarPagina(event);
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaTransacciones.filter = filterValue.trim().toLocaleLowerCase();
  }

  agregarEntrada() {
    this.dialog.open(ModalTransaccionComponent, {
      data: { tipoTransaccion: 'Ingreso' },
      disableClose: true
    }).afterClosed().subscribe({
      next: (resultado) => {
        if (resultado === "true") this.obtenerEntradas();
      },
      error: (error) => { }
    });
  }

  editarEntrada(transaccion: Transaccion) {
    this.dialog.open(ModalTransaccionComponent, {
      disableClose: true,
      data: transaccion

    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerEntradas();
    });
  }

  eliminarIngreso(transaccion: Transaccion) {
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
              this.obtenerEntradas();
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
