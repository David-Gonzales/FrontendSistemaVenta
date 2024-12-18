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

  columnasTabla:string[] = ['producto', 'cantidad', 'estado', 'precioUnitario', 'total', 'accion'];
  dataInicio:DetalleVenta[]=[];
  dataListaProductosVenta: MatTableDataSource<DetalleVenta> = new MatTableDataSource(this.dataInicio);

  productoSeleccionado:Producto | null=null;
  listaProductos: Producto[] = [];
  listaProductosVenta: DetalleVenta[] = [];
  cantidad: number = 1;
  tipoVenta: string[] = ["Normal", "Refill"];
    precioRefill: number = 0;
  tipoEstado: string[]= ["Lleno", "Vacío"];
    precioVacio: number = 0;
  tipoPago: string[] = ["Efectivo", "Tarjeta"];

  constructor(
    private _productoServicio: ProductoService
  ){
    this._productoServicio.listar().subscribe({
      next:(respuesta)=> {
        if(respuesta.succeeded){
          if(Array.isArray(respuesta.data)){
            this.listaProductos = respuesta.data;
          } else {
            console.error("La propiedad 'data' no es un arreglo de productos.");
          }
        }
      },
      error:(e)=>{}
    });
  }

  puedoAgregarProducto():boolean{
    return !!this.productoSeleccionado && this.cantidad > 0;
  }

  agregarProducto(){
    if( !this.productoSeleccionado || !this.puedoAgregarProducto()) return;

    const detalleVenta: DetalleVenta = {
      id : 0,
      cantidad: 0,
      tipoEstado: "Lleno",
      precioUnitario: 0.0,
      total: 0.0,

      idProducto: 0,
      nombreProducto: "",
      capacidadProducto: 0,
      unidadProducto: ""
    };

    this.listaProductosVenta.push(detalleVenta);
    this.resetearSeleccionado();
  }

  removerProducto(detalleVenta: DetalleVenta){
    const indice = this.listaProductosVenta.indexOf(detalleVenta);
    if(indice > -1){
      this.listaProductosVenta.splice(indice, 1);
    }
  }

  calcularTotal():number {
    return this.listaProductosVenta.reduce((sum, detalleVenta) => sum + detalleVenta.total, 0);
  }

  registrarVenta(){
    if(this.listaProductosVenta.length === 0){
      alert('Por favor, agregue al menos un producto');
      return;
    }

    console.log('Sale registered');
  }

  resetearSeleccionado(){
    this.productoSeleccionado = null;
    this.cantidad = 1;
    this.tipoEstado = [];
  }
}
