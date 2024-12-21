import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../../../Interfaces/producto';
import { ProductoService } from '../../../../Services/producto.service';
import { ProductoUpdateModel } from '../../../../Models/productoUpdateModel';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { ProductoModel } from '../../../../Models/productoModel';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.css'
})
export class ModalProductoComponent {
  formularioProducto: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService,
  ) {
    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      capacidad: ['', Validators.required],
      unidad: ['', Validators.required],
      stock: [{ value: '', disabled: true }, Validators.required],
      precio: ['', Validators.required],
      esActivo: ['true', Validators.required],
    });

    if (this.datosProducto != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    if (this.datosProducto != null) {
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        capacidad: this.datosProducto.capacidad,
        unidad: this.datosProducto.unidad,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo
      });
    } else {
      this.formularioProducto.get('stock')?.enable();
    }
  }

  guardarEditar_Producto() {
    if (this.datosProducto != null && this.datosProducto.id) {
      const _productoModificado: ProductoUpdateModel = {
        Id: this.datosProducto.id,
        Nombre: this.formularioProducto.getRawValue().nombre,
        Capacidad: this.formularioProducto.getRawValue().capacidad,
        Unidad: this.formularioProducto.getRawValue().unidad,
        Stock: this.formularioProducto.getRawValue().stock,
        Precio: this.formularioProducto.getRawValue().precio,
        EsActivo: Boolean(this.formularioProducto.getRawValue().esActivo)
      }
      this._productoServicio.editar(_productoModificado).subscribe({
        next: (respuesta) => {
          if (respuesta.succeeded) {
            this._utilidadServicio.mostrarAlerta("El producto fue modificado", "Éxito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo modificar el producto", "Error");
          }
        },
        error: (e) => { }
      });
    } else {
      const _productoCreado: ProductoModel = {
        Nombre: this.formularioProducto.value.nombre,
        Capacidad: this.formularioProducto.value.capacidad,
        Unidad: this.formularioProducto.value.unidad,
        Stock: this.formularioProducto.value.stock,
        Precio: this.formularioProducto.value.precio,
        EsActivo: Boolean(this.formularioProducto.value.esActivo)
      }
      this._productoServicio.guardar(_productoCreado).subscribe({
        next: (respuesta) => {
          if (respuesta.succeeded) {
            this._utilidadServicio.mostrarAlerta("El producto fue registrado", "Éxito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el producto", "Error");
          }
        },
        error: (e) => { }
      });
    }
  }

}
