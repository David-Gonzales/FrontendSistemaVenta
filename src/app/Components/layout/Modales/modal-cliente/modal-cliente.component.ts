import { Component, Inject } from '@angular/core';
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
export class ModalClienteComponent {
  formularioCliente:FormGroup;
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar";

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
      numeroDocumento:['',Validators.required],
      ciudad:['',Validators.required],
      fechaNacimiento:['',Validators.required],
      correo:['',Validators.required],
      telefono:['',Validators.required],
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
