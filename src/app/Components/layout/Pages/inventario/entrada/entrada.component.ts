import { Component } from '@angular/core';
import { SharedModule } from '../../../../../Reutilizable/shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Transaccion } from '../../../../../Interfaces/transaccion';

import { UtilidadService } from '../../../../../Reutilizable/utilidad.service';
import { TransaccionService } from '../../../../../Services/transaccion.service';


@Component({
  selector: 'app-entrada',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './entrada.component.html',
  styleUrl: './entrada.component.css'
})
export class EntradaComponent {

  columnasTabla: string[] = ['usuario', 'horaIngreso', 'fechaIngreso', 'cantidad', 'producto', 'estado', 'acciones'];

  listaTransacciones: Transaccion[] = [];
  dataListaTransacciones = new MatTableDataSource(this.listaTransacciones);

  constructor(
    private dialog: MatDialog,
    private _transaccionServicio: TransaccionService,
    private _utilidadServicio: UtilidadService
  ){
    this._transaccionServicio.listar().subscribe({
      next: (respuesta) => {
        if(respuesta.succeeded){
          if(Array.isArray(respuesta.data)){
            const lista = respuesta.data;
            this.listaTransacciones = lista.filter(t => t.esActivo == 1);
          } else {
            console.error("La propiedad 'data' no es un arreglo de transacciones.");
          }
        }
      },
      error: (e) => {}
    });
  }

  // agregarEntrada(){
  //   this.dialog.open('', {
  //         disableClose: true
  //       }).afterClosed().subscribe({
  //         next: (resultado) => {
  //           if (resultado) {

  //           }
  //         },
  //         error: (error) => { }
  //       });
  // }

  eliminarIngreso(transaccion: Transaccion){

  }
}
