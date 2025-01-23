import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from '../../../../Services/cliente.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { Cliente } from '../../../../Interfaces/cliente';
import { ClienteUpdateModel } from '../../../../Models/clienteUpdateModel';
import { ClienteModel } from '../../../../Models/clienteModel';

@Component({
  selector: 'app-modal-cliente',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './modal-cliente.component.html',
  styleUrl: './modal-cliente.component.css'
})
export class ModalClienteComponent implements OnInit{
  formularioCliente:FormGroup;
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar";
  maxLength: number = 8;

  constructor(
    private modalActual: MatDialogRef<ModalClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCliente:Cliente,
    private fb:FormBuilder,
    private _clienteServicio:ClienteService,
    private _utilidadServicio:UtilidadService,
  ){

    this.formularioCliente = this.fb.group({
      nombres:['',Validators.required],
      apellidos:['',Validators.required],
      tipoDocumento:['',Validators.required],
      numeroDocumento:['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      ciudad:['',Validators.required],
      fechaNacimiento:[Date || null, Validators.required],
      correo:['',Validators.required],
      telefono:['', [
        Validators.required,
        Validators.pattern('^[9][0-9]{8}$'),
        Validators.minLength(9),
        Validators.maxLength(9)
      ]],
      esActivo:['true',Validators.required],
    });

    if(this.datosCliente != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void{
    if(this.datosCliente != null){
      this.formularioCliente.patchValue({
        nombres: this.datosCliente.nombres,
        apellidos: this.datosCliente.apellidos,
        tipoDocumento: this.datosCliente.tipoDocumento,
        numeroDocumento: this.datosCliente.numeroDocumento,
        ciudad: this.datosCliente.ciudad,
        fechaNacimiento: this.datosCliente.fechaNacimiento,
        correo: this.datosCliente.correo,
        telefono: this.datosCliente.telefono,
        esActivo: this.datosCliente.esActivo,
      });
    }
    this.onTipoDocumentoChange(this.formularioCliente.get('tipoDocumento')?.value);
  }

  onTipoDocumentoChange(tipo: string): void {
    // Actualiza la longitud máxima según el tipo de documento
    if (tipo === 'DNI') {
      this.maxLength = 8;
    } else if (tipo === 'RUC') {
      this.maxLength = 11;
    }

    // Actualiza la validación para el campo de número de documento
    this.formularioCliente.get('numeroDocumento')?.setValidators([
      Validators.required,
      Validators.pattern('^[0-9]+$') // Solo números permitidos
    ]);

    // Recalcula la validación del formulario
    this.formularioCliente.get('numeroDocumento')?.updateValueAndValidity();
  }

  onTelefonoInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    // Elimina cualquier carácter que no sea un número
    inputElement.value = value.replace(/[^0-9]/g, '');

    // Actualiza la validación para asegurarse de que solo haya 9 caracteres
    this.formularioCliente.get('telefono')?.setValue(inputElement.value);
  }


  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    // Elimina cualquier carácter que no sea un número
    inputElement.value = value.replace(/[^0-9]/g, '');
  }

  guardarEditar_Cliente(){
    if(this.datosCliente != null && this.datosCliente.id){
      const _clienteModificado: ClienteUpdateModel ={
        Id: this.datosCliente.id,
        Nombres: this.formularioCliente.value.nombres,
        Apellidos: this.formularioCliente.value.apellidos,
        TipoDocumento: this.formularioCliente.value.tipoDocumento,
        NumeroDocumento: this.formularioCliente.value.numeroDocumento,
        Ciudad: this.formularioCliente.value.ciudad,
        FechaNacimiento: this.formularioCliente.value.fechaNacimiento,
        Correo: this.formularioCliente.value.correo,
        Telefono: this.formularioCliente.value.telefono,
        EsActivo: Boolean (this.formularioCliente.value.esActivo)
      }
      this._clienteServicio.editar(_clienteModificado).subscribe({
        next:(respuesta)=>{
          if(respuesta.succeeded){
            this._utilidadServicio.mostrarAlerta("El cliente fue modificado", "Éxito");
            this.modalActual.close("true");
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo modificar el cliente","Error");
          }
        },
        error:(e)=>{}
      });
    }else{
      const _clienteCreado:ClienteModel = {
        Nombres: this.formularioCliente.value.nombres,
        Apellidos: this.formularioCliente.value.apellidos,
        TipoDocumento: this.formularioCliente.value.tipoDocumento,
        NumeroDocumento: this.formularioCliente.value.numeroDocumento,
        Ciudad: this.formularioCliente.value.ciudad,
        FechaNacimiento: this.formularioCliente.value.fechaNacimiento,
        Correo: this.formularioCliente.value.correo,
        Telefono: this.formularioCliente.value.telefono,
        EsActivo: Boolean (this.formularioCliente.value.esActivo)
      }
      this._clienteServicio.guardar(_clienteCreado).subscribe({
        next:(respuesta)=>{
          if(respuesta.succeeded){
            this._utilidadServicio.mostrarAlerta("El cliente fue registrado", "Éxito");
            this.modalActual.close("true");
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el cliente","Error");
          }
        },
        error:(e)=>{}
      });
    }

  }
}
