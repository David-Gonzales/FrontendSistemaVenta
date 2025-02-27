import { Component } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductoService } from '../../../../Services/producto.service';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

import { Producto } from '../../../../Interfaces/producto';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';

import Swal from 'sweetalert2';
import { ModalVentaClienteComponent } from '../../Modales/modal-venta-cliente/modal-venta-cliente.component';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from '../../../../Interfaces/cliente';
import { VentaModel } from '../../../../Models/ventaModel';
import { DetalleVentaModel } from '../../../../Models/detalleVentaModel';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent {

  clienteSeleccionado: Cliente | null = null;
  nombreCompletoCliente: string = '';
  idCliente: number = 0;

  columnasTabla: string[] = ['producto', 'cantidad', 'tipoVenta', 'estado', 'precioUnitario', 'total', 'accion'];
  producto!: Producto; // El operador ! se llama non-null assertion operator y se utiliza para indicarle al compilador que confías en que una variable nunca será null o undefined
  listaProductos: Producto[] = []; // Se muestra en el combobox de "Selecciona un Producto"
  totalPagar: number = 0;

  listaProductosVenta: DetalleVenta[] = [];
  dataListaProductosVenta = new MatTableDataSource(this.listaProductosVenta);

  bloquearBotonRegistrar: boolean = false;

  cantidad: number = 0;
  tipoVenta: string = "";
  precioAdicional: number = 0;
  tipoEstado: string = '';
  tipoPago: string = '';

  formularioProductoVenta: FormGroup;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService

  ) {

    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
      tipoVenta: ['', Validators.required],
      tipoEstado: ['', Validators.required],
      tipoPago: ['', Validators.required],
      precioAdicional: [''],
    });

    this._productoServicio.listar().subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data)) {
            const lista = respuesta.data;
            // Filtramos los productos activos y stock mayor a 0
            this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stockGeneral > 0);
          } else {
            console.error("La propiedad 'data' no es un arreglo de productos.");
          }
        }
      },
      error: (e) => { }
    });
  }

  AgregarCliente() {
    this.dialog.open(ModalVentaClienteComponent, {
      disableClose: true
    }).afterClosed().subscribe({
      next: (resultado) => {
        if (resultado) {
          this.clienteSeleccionado = resultado.cliente;
          this.nombreCompletoCliente = resultado.nombreCompleto;
          this.idCliente = resultado.id;
        }
      },
      error: (error) => { }
    });
  }

  limpiarCliente(): void {
    Swal.fire({
      title: "¿Desea quitar este cliente?",
      text: this.nombreCompletoCliente,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí, quitar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, volver"
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.clienteSeleccionado = null;
        this.nombreCompletoCliente = 'Seleccione un Cliente';
        this.idCliente = 0;
      }
    })
  }

  //Método para manejar cambios en tipo de venta:
  onTipoVentaChange(tipoVenta: string) {
    this.tipoVenta = tipoVenta;

    if (tipoVenta === 'Refill') {
      this.tipoEstado = 'Lleno'; // El estado es siempre "Lleno" en Refill.
      this.formularioProductoVenta.controls['tipoEstado'].disable();
      this.formularioProductoVenta.controls['precioAdicional'].setValidators([Validators.required, Validators.min(1)]);
    } else {
      this.tipoEstado = ''; // Resetea el estado para ventas normales.
      this.formularioProductoVenta.controls['tipoEstado'].enable();
      this.formularioProductoVenta.controls['precioAdicional'].clearValidators();
    }
    this.formularioProductoVenta.controls['precioAdicional'].updateValueAndValidity();
  }

  agregarProducto() {

    if (this.formularioProductoVenta.invalid) {
      this._utilidadServicio.mostrarAlerta('Por favor, completa todos los campos obligatorios.', 'Error');
      return;
    }

    // Obtén el id del producto seleccionado desde el formulario
    const idProductoSeleccionado = this.formularioProductoVenta.value.producto;

    // Busca el producto en la lista de productos
    const productoSeleccionado = this.listaProductos.find(p => p.id === idProductoSeleccionado);

    if (!productoSeleccionado) {
      Swal.fire("Error", "Producto seleccionado no válido.", "warning");
      return;
    }

    // Verificar duplicados
    const productoDuplicadoTipoEstado = this.listaProductosVenta.find(
      (detalle) =>
        detalle.idProducto === productoSeleccionado.id &&
        detalle.tipoEstado === this.tipoEstado &&
        detalle.tipoVenta === this.tipoVenta
    );


    if (productoDuplicadoTipoEstado) {
      Swal.fire("Error", "Este producto ya fue agregado. Por favor, revise nuevamente", "warning");
      return;
    }

    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    //const _tipoEstado: string = this.formularioProductoVenta.value.tipoEstado;

    let precioUnitario = 0;
    // Ajustar el precio según el tipo de estado y venta
    if (this.tipoVenta === 'Normal') {
      if (this.tipoEstado === 'Lleno') {
        precioUnitario = productoSeleccionado ? productoSeleccionado.precio : 0;
      } else if (this.tipoEstado === 'Vacio') {
        precioUnitario = this.formularioProductoVenta.value.precioAdicional || 0;
      }
    } else if (this.tipoVenta === 'Refill') {
      precioUnitario = this.formularioProductoVenta.value.precioAdicional || 0;
    }
    // // Cálculo del precio unitario según el estado
    // const _precioUnitario =
    //   this.tipoEstado === "Lleno" ? productoSeleccionado.precio //operador de coalescencia nula (??) para proporcionar un valor predeterminado
    //     : this.precioAdicional; // Usa el precio vacío si corresponde

    const _total = _cantidad * precioUnitario;
    this.totalPagar += _total;

    if (!precioUnitario || precioUnitario <= 0) {
      Swal.fire("Error", "El precio no puede ser cero o negativo.", "warning");
      return;
    }

    const detalleVenta: DetalleVenta = {
      id: 0, // Valor por defecto 0
      cantidad: _cantidad,
      tipoEstado: this.tipoEstado,
      tipoVenta: this.tipoVenta,
      precioUnitario: precioUnitario,
      total: _total,

      idProducto: productoSeleccionado.id,
      nombreProducto: productoSeleccionado.nombre,
      capacidadProducto: productoSeleccionado.capacidad,
      unidadProducto: productoSeleccionado.unidad,
    };

    this.listaProductosVenta.push(detalleVenta);
    this.dataListaProductosVenta = new MatTableDataSource(this.listaProductosVenta);

    // Swal.fire("Éxito", "Producto agregado a la lista de venta.", "success");
    this.resetearSeleccionado();
    this.tipoEstado = 'X';
    this.bloquearBotonRegistrar = true;
  }


  removerProducto(detalleVenta: DetalleVenta) {
    console.log(detalleVenta);
    this.totalPagar = this.totalPagar - detalleVenta.total;
    const indice = this.listaProductosVenta.findIndex(
      p => p.idProducto === detalleVenta.idProducto
    );
    console.log(indice);
    //PRIMERA FORMA
    if (indice > -1) {
      this.listaProductosVenta.splice(indice, 1);
    }
    //SEGUNDA FORMA
    //this.listaProductosVenta = this.listaProductosVenta.filter(p=> p.id != detalleVenta.idProducto);
    this.dataListaProductosVenta = new MatTableDataSource(this.listaProductosVenta);

    if (this.listaProductosVenta.length == 0) {
      this.bloquearBotonRegistrar = false;
    }
  }

  calcularTotal(): number {
    return this.listaProductosVenta.reduce((sum, detalleVenta) => sum + detalleVenta.total, 0);
  }

  registrarVenta() {

    // Obtener el usuario desde el localStorage
    const usuarioLocalStorage = localStorage.getItem('usuario');
    let idUsuario = null;
    if (usuarioLocalStorage) {
      const usuario = JSON.parse(usuarioLocalStorage);
      idUsuario = usuario.idUsuario;
    } else {
      console.error('No se encontró el usuario en el localStorage.');
      this._utilidadServicio.mostrarAlerta("No se encontró el usuario. Inicia sesión nuevamente.", "Error");
      return; // Terminar la ejecución si no hay usuario
    }

    if (this.idCliente == 0) {
      Swal.fire("Error", "Por favor, seleccione un cliente", "warning");
      return; // Terminar la ejecución si no hay usuario
    }

    const listaDetallesVenta = this.listaProductosVenta.map(dv => {
      return new DetalleVentaModel(
        dv.idProducto,
        dv.cantidad,
        dv.tipoEstado,
        dv.tipoVenta,
        dv.precioUnitario,
        dv.total
      );
    });

    const venta = new VentaModel(
      this.tipoPago,
      listaDetallesVenta,
      this.idCliente,
      idUsuario
    );

    Swal.fire({
      title: "¿Desea registrar la venta?",
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí, registrar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, volver"
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        if (venta != null) {
          this._ventaServicio.guardar(venta).subscribe({
            next: (respuesta) => {
              if (respuesta.succeeded) {
                Swal.fire({
                  title: "Éxito",
                  text: "¡Venta registrada!",
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(() => {
                  this.resetearSeleccionado();
                  this.tipoEstado = 'X';
                  this.bloquearBotonRegistrar = true;
                  window.location.reload();
                });

              } if (respuesta.succeeded === false) {
                const mensaje = respuesta.message;
                this._utilidadServicio.mostrarAlerta("No se pudo registrar la venta" + mensaje, "Error");
              }
            },
            error: (error) => {
              let mensaje = error.error?.Message || error.Message || "Error al registrar la venta";

              // Buscar el ID del producto en el mensaje
              const idProductoMatch = mensaje.match(/ID (\d+)/);
              if (idProductoMatch) {
                const idProducto = parseInt(idProductoMatch[1], 10);

                // Buscar el nombre del producto en la lista
                const producto = this.listaProductos.find(p => p.id === idProducto);
                if (producto) {
                  // Reemplazar el ID con el nombre del producto
                  mensaje = mensaje.replace(`con ID ${idProducto}`, producto.nombre + " " + producto.capacidad + " " + producto.unidad);
                }
              }

              // Separar las partes del mensaje para formatearlo
              const partes = mensaje.match(/^(.*en estado \w+)\. Disponible: (\d+), solicitado: (\d+)/);
              let htmlMensaje = mensaje; // Fallback en caso de que no coincida el patrón

              if (partes) {
                htmlMensaje = `
                ${partes[1]}<br>
                <strong>Disponible:</strong> ${partes[2]}<br>
                <strong>Solicitado:</strong> ${partes[3]}`;
              }


              // Mostrar mensaje al cliente en un modal de SweetAlert
              Swal.fire({
                title: "Error",
                html: htmlMensaje,
                icon: "error",
                confirmButtonText: "OK",
              });

            }
          });;
        }
      }
    });
  }

  resetearSeleccionado() {
    this.formularioProductoVenta.patchValue({
      producto: 'x',
      cantidad: 0,//?
      tipoVenta: 'x',
      tipoEstado: 'x',
    });
  }
}
