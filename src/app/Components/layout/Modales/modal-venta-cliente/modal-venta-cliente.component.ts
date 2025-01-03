import { Component, HostListener, ViewChild} from '@angular/core';
import { Cliente } from '../../../../Interfaces/cliente';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ClienteService } from '../../../../Services/cliente.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-venta-cliente',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './modal-venta-cliente.component.html',
  styleUrl: './modal-venta-cliente.component.css'
})
export class ModalVentaClienteComponent {

  columnasTabla: string[] = ['nombres', 'apellidos', 'tipoDocumento', 'numeroDocumento', 'ciudad'];
  dataInicio: Cliente[] = [];
  dataListaClientes: MatTableDataSource<Cliente> = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  formularioBusquedaCliente: FormGroup;

  constructor(
    private modalActual: MatDialogRef<ModalVentaClienteComponent>,
    private fb: FormBuilder,
    private _clienteServicio: ClienteService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioBusquedaCliente = this.fb.group({
      tipoDocumento: [''],
      numeroDocumento: [''],
      nombres: [''],
      apellidos: [''],
      ciudad: [''],
    });
  }

  obtenerClientes(){
    this._clienteServicio.listar().subscribe({
      next:(respuesta)=> {
        if(respuesta.succeeded){
          if (Array.isArray(respuesta.data)) {
            this.dataListaClientes.data = respuesta.data;
          } else {
            console.error("La propiedad 'data' no es un arreglo de Clientes.");
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Opps!");
          }
        }
        else this._utilidadServicio.mostrarAlerta("Error al obtener los clientes","Opps!");
      },
      error:(e)=>{}
    });
  }

  ngOnInit(): void{
    this.obtenerClientes();
  }

  ngAfterViewInit(): void {
    this.dataListaClientes.paginator = this.paginacionTabla;
  }

  clienteSeleccionado: any = null;

  // Evento que detecta clic fuera de la tabla
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Si el clic no es dentro de la tabla, deseleccionamos
    const tableElement = document.querySelector('.clientes-dialog-content');
    if (tableElement && !tableElement.contains(event.target as Node)) {
      this.clienteSeleccionado = null;
    }
  }


  seleccionarCliente(cliente: Cliente): void {
    if (this.clienteSeleccionado === cliente) {
      //No pasa nada
    } else {
      this.clienteSeleccionado = cliente; // Seleccionamos el cliente
    }
  }

  confirmarSeleccion(): void {
    if (this.clienteSeleccionado) {
      this.modalActual.close({
        cliente: this.clienteSeleccionado,
        nombreCompleto: this.clienteSeleccionado.nombres + ' ' + this.clienteSeleccionado.apellidos,
        id: this.clienteSeleccionado.id
      });
    } else {
      console.log('No se ha seleccionado ningún cliente');
    }
  }

  cancelar():void{
    this.modalActual.close(null);
  }
}
