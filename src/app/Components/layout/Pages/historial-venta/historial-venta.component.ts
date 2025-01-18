import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { HistorialVenta } from '../../../../Interfaces/historial-venta';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { VentaService } from '../../../../Services/venta.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { ModalHistorialVentasComponent } from '../../Modales/modal-historial-ventas/modal-historial-ventas.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import 'moment/locale/es';

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
  selector: 'app-historial-venta',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './historial-venta.component.html',
  styleUrl: './historial-venta.component.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    provideMomentDateAdapter(),
  ],
})
export class HistorialVentaComponent implements AfterViewInit {

  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly _intl = inject(MatDatepickerIntl);
  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));
  readonly dateFormatString = computed(() => {
    return 'DD/MM/YYYY';
  });


  columnasTabla: string[] = ['fechaRegistro', 'horaRegistro', 'numeroVenta', 'tipoPago', 'cliente', 'total', 'accion'];
  dataInicio: HistorialVenta[] = [];
  dataListaHistorialVentas: MatTableDataSource<HistorialVenta> = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  formularioBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    { value: "fecha", descripcion: "Fechas" },
    { value: "numero", descripcion: "Número Venta" }
  ];


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ) {

    this.formularioBusqueda = fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });

    //Cuando cambia el valor del buscarPor que se limpie esa búsqueda
    this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(value => {
      this.formularioBusqueda.patchValue({
        numero: "",
        fechaInicio: "",
        fechaFin: ""
      });
    })
  }

  obtenerHistorialVentas() {
    this._ventaServicio.listar().subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data)) {
            this.dataListaHistorialVentas.data = respuesta.data;
          } else {
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Opps!");
          }
        }
      },
      error: (e) => { }
    });
  }

  ngOnInit(): void {
    this.obtenerHistorialVentas();
  }

  ngAfterViewInit(): void {
    this.dataListaHistorialVentas.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataListaHistorialVentas.filter = filtro.trim().toLocaleLowerCase();
  }

  buscarVentas() {
    let _fechaInicio: string = "";
    let _fechaFin: string = "";

    if (this.formularioBusqueda.value.buscarPor === "fecha") {
      //encapsular con moment
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('YYYY/MM/DD');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('YYYY/MM/DD');

      if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
        this._utilidadServicio.mostrarAlerta("Ingresar ambas fechas", "Oops!");
        return;
      }
    }

    const params = {
      BuscarPor: this.formularioBusqueda.value.buscarPor,
      NumeroVenta: this.formularioBusqueda.value.numero,
      FechaInicio: _fechaInicio,
      FechaFin: _fechaFin,
    };

    this._ventaServicio.listar(params).subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data)) {
            this.dataListaHistorialVentas.data = respuesta.data;
          } else {
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
          }
        }
      },
      error: (e) => {
        this._utilidadServicio.mostrarAlerta('Error al consultar las ventas', 'Error');
      }
    });
  }

  verDetalleVenta(historialVenta: HistorialVenta) {
    this.dialog.open(ModalHistorialVentasComponent, {
      disableClose: true,
      data: historialVenta

    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerHistorialVentas();
    });
  }
}
