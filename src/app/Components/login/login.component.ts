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
export class LoginComponent {
  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService,
  ) {
    this.formularioLogin = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  ngOnInit(): void {
  }

  iniciarSesion() {
    this.mostrarLoading = true;
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password,
    }
    // Primero, obtener todos los usuarios para validar si está activo

    this._usuarioServicio.listar().subscribe({
      next: (respuesta) => {
        if (respuesta.succeeded && Array.isArray(respuesta.data)) {

          const usuarios = respuesta.data;

          const usuarioEncontrado = usuarios.find(
            (usuario) => usuario.correo === request.correo
          );

          if (usuarioEncontrado) {
            // Verificar si el usuario está activo
            if (usuarioEncontrado.esActivo === true) {
              // Si está activo, proceder con el inicio de sesión
              this._usuarioServicio.iniciarSesion(request).subscribe({
                next: (respuesta) => {
                  if (respuesta.succeeded) {
                    this._utilidadServicio.guardarSesionUsuario(respuesta.data);
                    this.router.navigate(["pages"]);
                  } else {
                    this._utilidadServicio.mostrarAlerta(
                      "No se encontraron coincidencias",
                      "Opps!"
                    );
                  }
                },
                complete: () => {
                  this.mostrarLoading = false;
                },
                error: () => {
                  this._utilidadServicio.mostrarAlerta("Hubo un error", "Opps!");
                  this.mostrarLoading = false;
                },
              });
            } else {
              // Si el usuario no está activo
              this._utilidadServicio.mostrarAlerta(
                "Tu cuenta está inactiva. Contacta al administrador.",
                "Cuenta Inactiva"
              );
              this.mostrarLoading = false;
            }
          } else {
            // Si no se encontró el usuario en la lista
            this._utilidadServicio.mostrarAlerta(
              "El correo no está registrado.",
              "Opps!"
            );
            this.mostrarLoading = false;
          }

        }

      },
      error: () => {
        this._utilidadServicio.mostrarAlerta(
          "Error al obtener la lista de usuarios.",
          "Opps!"
        );
        this.mostrarLoading = false;
      },
    });
  }
}
