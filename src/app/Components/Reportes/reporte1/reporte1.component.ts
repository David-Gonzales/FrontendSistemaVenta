import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SharedModule } from '../../../Reutilizable/shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

import { VentaService } from '../../../Services/venta.service';
import { UtilidadService } from '../../../Reutilizable/utilidad.service';


import 'moment/locale/es';
import * as XLSX from "xlsx";
import { ReporteVentasPorFecha } from '../../../Interfaces/reporte-ventas-por-fecha';
import { ReporteService } from '../../../Services/reporte.service';

//Otra forma de configuarción de Fecha según CodigoEstudiante que también está en SharedModule (desde el Shared no lo he exportado)
export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-reporte1',
  standalone: true,
  imports: [SharedModule],
  providers: [
        { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS },
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
        provideMomentDateAdapter(),
      ],
  templateUrl: './reporte1.component.html',
  styleUrl: './reporte1.component.css'
})
export class Reporte1Component implements OnInit {

  totalRegistros: number = 0; // Total de registros en el backend
  pageSize: number = 10; // Tamaño de página inicial
  pageIndex: number = 0; // Página actual

  isLoading: boolean = false;
  isSearchButtonEnabled: boolean = false;
  readonly dateFormatString = computed(() => {
    return 'DD/MM/YYYY';
  });

  formularioFiltro: FormGroup;
  listaVentasReporte: ReporteVentasPorFecha[] = [];
  columnasTabla: string[] = ['fechaRegistro', 'horaRegistro', 'numeroVenta', 'tipoPago', 'cliente', 'producto', 'cantidad', 'tipoVenta', 'tipoEstado', 'precio', 'totalProducto'];

  dataVentaReporte : MatTableDataSource<ReporteVentasPorFecha> = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;


  constructor(
    private fb: FormBuilder,
        private _ventaServicio: VentaService,
        private _reporteServicio: ReporteService,
        private _utilidadServicio: UtilidadService
  ){
    this.formularioFiltro = fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    }, {validators: this.validarRangoFechas.bind(this)});
  }
  ngOnInit(): void {

  }

  cambiarPagina(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscarVentas();
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
    this.paginacionTabla.page.subscribe((event: PageEvent) => {
      this.cambiarPagina(event);
    });
  }

  validarRangoFechas(group: FormGroup) {
    const fechaInicio = group.get('fechaInicio')?.value;
    const fechaFin = group.get('fechaFin')?.value;
    if (fechaInicio && fechaFin && moment(fechaInicio).isBefore(fechaFin)) {
      return null;
    } else {
      return { rangoFechasInvalido: true };
    }
  }

  validarFormulario() {
    if (this.formularioFiltro.valid) {
      this.isSearchButtonEnabled = true; // Si el formulario es válido, habilitamos el botón
    } else {
      this.isSearchButtonEnabled = false; // Si el formulario es inválido, deshabilitamos el botón
    }
  }

  buscarVentas(){
    this.isLoading = true;
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('YYYY/MM/DD');
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format('YYYY/MM/DD');

    if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
      this._utilidadServicio.mostrarAlerta("Ingresar ambas fechas", "Oops!");
      return;
    }

    this._reporteServicio.VentasPorFecha(
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (respuesta) => {
        if(respuesta.succeeded){
          if (Array.isArray(respuesta.data)) {
            this.listaVentasReporte = respuesta.data;
            this.dataVentaReporte.data = respuesta.data;
          }else{
            this._utilidadServicio.mostrarAlerta("Data no es un arreglo de reporte de fechas por venta", "Opps!");
          }

        }else{
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {
        console.error('Error al obtener las ventas:', e);
        this._utilidadServicio.mostrarAlerta('Hubo un error al cargar las ventas.', 'Error');
      },
      complete: () => { this.isLoading = false; }
    });
  }

  exportarExcel(){

    const exportData = this.listaVentasReporte.map(item => {
      const fechaRegistro = new Date(item.fechaRegistro); // Convierte a Date
      const fecha = fechaRegistro.toLocaleDateString(); // Obtén la fecha en formato local
      const hora = fechaRegistro.toLocaleTimeString();
      return{
        Fecha: fecha,
        Hora: hora,
        'Número de Venta': item.numeroVenta,
        'Tipo de Pago': item.tipoPago,
        Cliente: item.cliente,
        Producto: item.producto,
        Cantidad: item.cantidad,
        'Tipo de Venta': item.tipoVenta,
        'Tipo de Estado': item.tipoEstado,
        'Precio': item.precio,
        Total: item.totalProducto,
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.book_append_sheet(wb, ws, "Reporte Ventas por Fecha");
    XLSX.writeFile(wb, "Reporte Ventas por Fechas.xlsx");
  }
}
