import { Component, computed, inject, Inject, signal } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Transaccion } from '../../../../Interfaces/transaccion';
import { TransaccionService } from '../../../../Services/transaccion.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { TransaccionUpdateModel } from '../../../../Models/transaccionUpdateModel';
import { TransaccionModel } from '../../../../Models/transaccionModel';
import { Usuario } from '../../../../Interfaces/usuario';
import { UsuarioService } from '../../../../Services/usuario.service';
import { ProductoService } from '../../../../Services/producto.service';
import { Producto } from '../../../../Interfaces/producto';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

import 'moment/locale/es';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import moment from 'moment';

@Component({
  selector: 'app-modal-transaccion',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './modal-transaccion.component.html',
  styleUrl: './modal-transaccion.component.css',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    provideMomentDateAdapter(),
  ],
})
export class ModalTransaccionComponent {

  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly _intl = inject(MatDatepickerIntl);
  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));
  readonly dateFormatString = computed(() => {
    return 'DD/MM/YYYY';
  });
  readonly timeFormatString = computed(() => {
    return 'HH:MM';
  });

  formularioTransaccion: FormGroup;
  tituloAccion: string = "Nueva";
  titulo2:string = "";
  botonAccion: string = "Guardar";

  listaUsuarios: Usuario[] = [];
  listaProductos: Producto[] = [];
  fechaFinal!: Date;

  constructor(
    private modalActual: MatDialogRef<ModalTransaccionComponent>,
    @Inject(MAT_DIALOG_DATA) public datosTransaccion: Transaccion,
    private fb: FormBuilder,
    private _usuarioServicio: UsuarioService,
    private _productoServicio: ProductoService,
    private _transaccionServicio: TransaccionService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioTransaccion = this.fb.group({
      idUsuario: ['', Validators.required],
      hora: ['', Validators.required],
      fecha: [Date || null, Validators.required],
      cantidad: ['', Validators.required],
      idProducto: ['', Validators.required],
      estado: ['', Validators.required],
    });

    if (datosTransaccion.id != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    if(datosTransaccion.tipoTransaccion == "Ingreso"){
      this.titulo2 = "Entrada";
    }
    else{
      this.titulo2 = "Salida";
    }

    this._usuarioServicio.listar().subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data)) {
            const lista = respuesta.data;
            this.listaUsuarios = lista.filter(u => u.esActivo == 1);
          }
          else {
            console.error("La propiedad 'data' no es un arreglo de usuarios.");
          }
        }
      },
      error: (e) => { }
    });

    this._productoServicio.listar().subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded) {
          if (Array.isArray(respuesta.data)) {
            const lista = respuesta.data;
            // Filtramos los productos activos y stock mayor a 0
            this.listaProductos = lista.filter(p => p.esActivo == 1);
          }
          else {
            console.error("La propiedad 'data' no es un arreglo de productos.");
          }
        }
      },
      error: (e) => { }
    });
  }

  ngOnInit(): void {
    if (this.datosTransaccion != null) {
      const horaFormateada = moment(this.datosTransaccion.fecha).format('HH:mm');
      console.log("Fecha inicial:", this.datosTransaccion.fecha);
      console.log("Hora formateada:", horaFormateada);


      this.formularioTransaccion.patchValue({
        idUsuario: this.datosTransaccion.idUsuario,
        hora: horaFormateada,
        fecha: moment(this.datosTransaccion.fecha),
        cantidad: this.datosTransaccion.cantidad,
        idProducto: this.datosTransaccion.idProducto,
        estado: this.datosTransaccion.tipoEstado,
      });
    }
  }

  guardarEditar_Transaccion() {

    // Obtener los valores de fecha y hora del formulario
    const fechaMoment = this.formularioTransaccion.value.fecha;
    const hora = this.formularioTransaccion.value.hora;

    if (moment.isMoment(fechaMoment)) {
      // Asegúrate de convertir fechaMoment a una cadena ISO válida
      const fechaISO = fechaMoment.toISOString();

      // Combina fecha y hora
      const [horas, minutos, segundos] = hora.split(':');
      const fechaFinal = new Date(fechaISO);
      fechaFinal.setHours(+horas); // Convertir a número y establecer horas
      fechaFinal.setMinutes(+minutos);

      this.fechaFinal = fechaFinal;
      console.log("Fecha ISO:", fechaISO);
      console.log("Fecha Final:", fechaFinal);

      // Aquí puedes usar fechaFinal para enviarla al backend
    } else {
      console.error("El valor de 'fecha' no es un objeto Moment válido");
    }

    if (this.datosTransaccion.id) {

      const _transaccionModificada: TransaccionUpdateModel = {
        Id: this.datosTransaccion.id,
        TipoTransaccion: this.datosTransaccion.tipoTransaccion,
        Fecha: this.fechaFinal,
        Cantidad: this.formularioTransaccion.value.cantidad,
        TipoEstado: this.formularioTransaccion.value.estado,
        IdProducto: this.formularioTransaccion.value.idProducto,
        IdUsuario: this.formularioTransaccion.value.idUsuario
      }
      this._transaccionServicio.editar(_transaccionModificada).subscribe({
        next: (respuesta) => {
          if (respuesta.succeeded) {
            this._utilidadServicio.mostrarAlerta("La entrada fue modificada", "Éxito");
            this.modalActual.close("true");
          }
          else if(respuesta.succeeded === false){
            this._utilidadServicio.mostrarAlerta("No se pudo modificar la entrada", "Error");
          }
        },
        error: (e) => { }
      });
    }
    else {
      const _transaccionCreada: TransaccionModel = {
        TipoTransaccion: this.datosTransaccion.tipoTransaccion,
        Fecha: this.fechaFinal,
        Cantidad: this.formularioTransaccion.value.cantidad,
        TipoEstado: this.formularioTransaccion.value.estado,
        IdProducto: this.formularioTransaccion.value.idProducto,
        IdUsuario: this.formularioTransaccion.value.idUsuario
      }
      this._transaccionServicio.guardar(_transaccionCreada).subscribe({
        next: (respuesta) => {
          if (respuesta.succeeded) {
            this._utilidadServicio.mostrarAlerta("Se registró la entrada", "Éxito");
            this.modalActual.close("true");
          }
          else if(respuesta.succeeded === false){
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la entrada", "Error");
          }
        },
        error: (e) => { }
      });
    }
  }
}
