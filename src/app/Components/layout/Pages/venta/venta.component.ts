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

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent {

  columnasTabla: string[] = ['producto', 'cantidad', 'estado', 'precioUnitario', 'total', 'accion'];
  // dataInicio: DetalleVenta[] = [];
  // dataListaProductosVenta: MatTableDataSource<DetalleVenta> = new MatTableDataSource(this.dataInicio);

  // productoSeleccionado!: Producto; // El operador ! se llama non-null assertion operator y se utiliza para indicarle al compilador que confías en que una variable nunca será null o undefined
  productoSeleccionado: Producto | null = null
  producto: Producto | null = null;
  listaProductos: Producto[] = []; // Se muestra en el combobox de "Selecciona un Producto"
  totalPagar: number = 0;

  listaProductosVenta: DetalleVenta[] = [];
  dataListaProductosVenta = new MatTableDataSource(this.listaProductosVenta);

  bloquearBotonRegistrar: boolean = false;

  cantidad: number = 0;
  tipoVenta: string[] = ["Normal", "Refill"];
    precioRefill: number = 0;
  tipoEstado: string ='';
  precioVacio: number = 0;
  tipoPago: string = '';

  formularioProductoVenta: FormGroup;



  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService

  ) {

    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required]
    });

    this._productoServicio.listar().subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data)) {
            const lista = respuesta.data;
            this.listaProductos = lista.filter(p=> p.esActivo == 1 && p.stock > 0);
          } else {
            console.error("La propiedad 'data' no es un arreglo de productos.");
          }
        }
      },
      error: (e) => { }
    });

    this._productoServicio.obtener(1).subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data) && respuesta.data.length > 0) {
            // Asignar el primer elemento si `data` es un array
            this.producto = respuesta.data[0];
          } else if (respuesta.data) {
            // Asignar directamente si `data` es un objeto `Producto`
            this.producto = respuesta.data as Producto;
          } else {
            console.error("La propiedad 'data' no contiene un producto válido...");
          }
        }
      },
      error: (e) => { }
    });
  }

  puedoAgregarProducto(): boolean {
    return !!this.productoSeleccionado && this.cantidad > 0 && !!this.tipoEstado && !!this.tipoPago;
  }

  agregarProducto() {
    if (!this.productoSeleccionado || !this.puedoAgregarProducto()) {
      return;
    }

    // Verificar duplicados
    const productoDuplicado = this.listaProductosVenta.find(
      (detalle) =>
        detalle.idProducto === this.productoSeleccionado?.id &&
        detalle.tipoEstado === this.tipoEstado[0]
    );

    if (productoDuplicado) {
      Swal.fire("Error", "Este producto ya fue agregado con el mismo estado.", "warning");
      return;
    }

    const _cantidad:number = this.formularioProductoVenta.value.cantidad;
    // Cálculo del precio unitario según el estado
    const _precioUnitario =
      this.tipoEstado === "Lleno"
        ? this.producto?.precio ?? 0 //operador de coalescencia nula (??) para proporcionar un valor predeterminado
        : this.precioVacio; // Usa el precio vacío si corresponde

    const _total = _cantidad * _precioUnitario;
    this.totalPagar += _total;

    if (!_precioUnitario || _precioUnitario <= 0) {
      Swal.fire("Error", "El precio no puede ser cero o negativo.", "warning");
      return;
    }

    const detalleVenta: DetalleVenta = {
      id: this.producto?.id ?? 0, // Valor por defecto 0
      cantidad: _cantidad,
      tipoEstado: this.tipoEstado,
      precioUnitario: _precioUnitario,
      total: _total,

      idProducto: this.productoSeleccionado.id,
      nombreProducto: this.productoSeleccionado.nombre,
      capacidadProducto: this.productoSeleccionado.capacidad,
      unidadProducto: this.productoSeleccionado.unidad,
    };

    this.listaProductosVenta.push(detalleVenta);
    //this.dataListaProductosVenta.data = [...this.listaProductosVenta]; //algo falta aquí?
    this.dataListaProductosVenta = new MatTableDataSource(this.listaProductosVenta);

    Swal.fire("Éxito", "Producto agregado a la lista de venta.", "success");
    this.resetearSeleccionado();
  }

  removerProducto(detalleVenta: DetalleVenta) {
    this.totalPagar = this.totalPagar - detalleVenta.total;
    const indice = this.listaProductosVenta.indexOf(detalleVenta);
    //PRIMERA FORMA
    if (indice > -1) {
      this.listaProductosVenta.splice(indice, 1);
    }
    //SEGUNDA FORMA
    //this.listaProductosVenta = this.listaProductosVenta.filter(p=> p.id != detalleVenta.idProducto);
    //this.dataListaProductosVenta = new MatTableDataSource(this.listaProductosVenta);
  }

  calcularTotal(): number {
    return this.listaProductosVenta.reduce((sum, detalleVenta) => sum + detalleVenta.total, 0);
  }

  registrarVenta() {
    if (this.listaProductosVenta.length > 0) {
      this.bloquearBotonRegistrar = true;
      /*
      const request: Venta = {
        ...
      }
      */
    }else{
      alert('Por favor, agregue al menos un producto');
      return;
    }

    console.log('Venta registrada');
  }

  resetearSeleccionado() {
    this.formularioProductoVenta.patchValue({
      producto:'',
      cantidad:'',//?
    });
    this.cantidad = 0;//?
    this.tipoEstado = '';
    this.tipoPago = '';
  }
}
