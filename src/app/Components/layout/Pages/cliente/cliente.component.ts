import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { Cliente } from '../../../../Interfaces/cliente';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ClienteService } from '../../../../Services/cliente.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { ModalClienteComponent } from '../../Modales/modal-cliente/modal-cliente.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {

  totalRegistros: number = 0; // Total de registros en el backend
  pageSize: number = 10; // Tamaño de página inicial
  pageIndex: number = 0; // Página actual

  columnasTabla: string[] = ['nombres', 'apellidos', 'tipoDocumento', 'numeroDocumento', 'ciudad', 'edad', 'correo', 'telefono', 'estado', 'acciones']
  dataInicio: Cliente[] = [];
  dataListaClientes: MatTableDataSource<Cliente> = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _clienteServicio: ClienteService,
    private _utilidadServicio: UtilidadService
  ) { }

  obtenerClientes() {
    const pageNumber = this.pageIndex + 1;
    this._clienteServicio.listar(pageNumber, this.pageSize).subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data)) {
            this.dataListaClientes.data = respuesta.data;
            this.totalRegistros = respuesta.totalCount;

            // Actualizar el estado del paginador manualmente
            if (this.paginacionTabla) {
              this.paginacionTabla.length = this.totalRegistros;
              this.paginacionTabla.pageIndex = this.pageIndex;
            }
          } else {
            console.error("La propiedad 'data' no es un arreglo de Clientes.");
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Opps!");
          }
        }
        else this._utilidadServicio.mostrarAlerta("Error al obtener los clientes", "Opps!");
      },
      error: (e) => { }
    });
  }

  cambiarPagina(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    //this.obtenerClientes();
  }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  ngAfterViewInit(): void {
    this.dataListaClientes.paginator = this.paginacionTabla;
    this.paginacionTabla.page.subscribe((event: PageEvent) => {
      this.cambiarPagina(event);
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaClientes.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoCliente() {
    this.dialog.open(ModalClienteComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerClientes();
    });
  }

  editarCliente(cliente: Cliente) {
    this.dialog.open(ModalClienteComponent, {
      disableClose: true,
      data: cliente

    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerClientes();
    });
  }

  eliminarCliente(cliente: Cliente) {
    // Verificar si el cliente tiene ventas asociadas
    this._clienteServicio.tieneVentas(cliente.id).subscribe({
      next: (tieneVentas) => {
        if (tieneVentas) {
          // Si tiene ventas, mostramos el mensaje de advertencia
          Swal.fire({
            title: "No se puede eliminar este cliente",
            text: "Este cliente tiene ventas asociadas y no puede ser eliminado.",
            icon: "error",
            confirmButtonColor: '#3085d6',
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "¿Desea eliminar el cliente?",
            text: cliente.nombres + " " + cliente.apellidos,
            icon: "warning",
            confirmButtonColor: '#3085d6',
            confirmButtonText: "Sí, eliminar",
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: "No, volver"
          }).then((resultado) => {
            if (resultado.isConfirmed) {
              this._clienteServicio.eliminar(cliente.id).subscribe({
                next: (respuesta) => {
                  if (respuesta.succeeded) {
                    this._utilidadServicio.mostrarAlerta("El cliente fue eliminado", "Listo!");
                    this.obtenerClientes();
                  } else {
                    this._utilidadServicio.mostrarAlerta("No se pudo eliminar el cliente", "Error");
                  }
                },
                error: (e) => { }
              });
            }
          })
        }
      }
    });
  }
}
