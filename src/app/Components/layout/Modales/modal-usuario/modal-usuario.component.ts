import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '../../../../Interfaces/usuario';
import { RolService } from '../../../../Services/rol.service';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { UsuarioModel } from '../../../../Models/usuarioModel';
import { UsuarioUpdateModel } from '../../../../Models/usuarioUpdateModel';
import { Rol } from '../../../../Interfaces/rol';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css'
})
export class ModalUsuarioComponent {
  formularioUsuario:FormGroup;
  ocultarPassword:boolean=true;
  tituloAccion:string="Agregar";
  botonAccion:string="Guardar";
  listaRoles:Rol[]=[];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario:Usuario,
    private fb:FormBuilder,
    private _rolServicio:RolService,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio:UtilidadService,
  ){

    this.formularioUsuario = this.fb.group({
      nombres:['',Validators.required],
      apellidos:['',Validators.required],
      telefono:['',Validators.required],
      correo:['',Validators.required],
      clave:['',Validators.required],
      idRol:['',Validators.required],
      esActivo:['true',Validators.required],
    });

    if(this.datosUsuario != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    this._rolServicio.listar().subscribe({
      next:(respuesta)=> {
        if(respuesta.succeeded){
          if(Array.isArray(respuesta.data)){
            this.listaRoles = respuesta.data;
          } else {
            console.error("La propiedad 'data' no es un arreglo de roles.");
          }
        }
      },
      error:(e)=>{}
    });
  }

  ngOnInit(): void{
    if(this.datosUsuario != null){
      this.formularioUsuario.patchValue({
        nombres: this.datosUsuario.nombres,
        apellidos: this.datosUsuario.apellidos,
        telefono: this.datosUsuario.telefono,
        correo: this.datosUsuario.correo,
        clave: this.datosUsuario.clave,
        idRol: this.datosUsuario.idRol,
        esActivo: this.datosUsuario.esActivo,
      });
    }
  }


  guardarEditar_Usuario(){
    if(this.datosUsuario != null && this.datosUsuario.id){
      const _usuarioModificado: UsuarioUpdateModel ={
        Id: this.datosUsuario.id,
        Nombres: this.formularioUsuario.value.nombres,
        Apellidos: this.formularioUsuario.value.apellidos,
        Telefono: this.formularioUsuario.value.telefono,
        Correo: this.formularioUsuario.value.correo,
        Clave: this.formularioUsuario.value.clave,
        IdRol: this.formularioUsuario.value.idRol,
        EsActivo: Boolean (this.formularioUsuario.value.esActivo)
      }
      this._usuarioServicio.editar(_usuarioModificado).subscribe({
        next:(respuesta)=>{
          if(respuesta.succeeded){
            this._utilidadServicio.mostrarAlerta("El usuario fue modificado", "Éxito");
            this.modalActual.close("true");
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo modificar el usuario","Error");
          }
        },
        error:(e)=>{}
      });
    }else{
      const _usuarioCreado:UsuarioModel = {
        Nombres: this.formularioUsuario.value.nombres,
        Apellidos: this.formularioUsuario.value.apellidos,
        Telefono: this.formularioUsuario.value.telefono,
        Correo: this.formularioUsuario.value.correo,
        Clave: this.formularioUsuario.value.clave,
        IdRol: this.formularioUsuario.value.idRol,
        EsActivo: Boolean(this.formularioUsuario.value.esActivo)
      }
      this._usuarioServicio.guardar(_usuarioCreado).subscribe({
        next:(respuesta)=>{
          if(respuesta.succeeded){
            this._utilidadServicio.mostrarAlerta("El usuario fue registrado", "Éxito");
            this.modalActual.close("true");
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el usuario","Error");
          }
        },
        error:(e)=>{}
      });
    }

  }
}
