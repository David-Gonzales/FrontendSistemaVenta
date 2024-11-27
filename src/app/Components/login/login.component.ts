import { Component } from '@angular/core';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../Services/usuario.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';
import { Login } from '../../Interfaces/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  formularioLogin:FormGroup;
  ocultarPassword:boolean=true;
  mostrarLoading:boolean=false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService,
  ){
    this.formularioLogin = this.fb.group({
      email:["", Validators.required],
      password:["", Validators.required],
    });
  }

  ngOnInit():void{
  }

  iniciarSesion(){
    this.mostrarLoading = true;
    const request: Login = {
      correo : this.formularioLogin.value.email,
      clave : this.formularioLogin.value.password,
    }

    this._usuarioServicio.iniciarSesion(request).subscribe({
      next:(respuesta)=> {
        if(respuesta.succeeded){
          this._utilidadServicio.guardarSesionUsuario(respuesta.data);
          this.router.navigate(["pages"]);
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron coincidencias", "Opps!");

        }
      },
      complete:() => {
        this.mostrarLoading = false;
      },
      error: () => {
        this._utilidadServicio.mostrarAlerta("Hubo un error", "Opps!");
        this.mostrarLoading = false;
      }
    });
  }
}
