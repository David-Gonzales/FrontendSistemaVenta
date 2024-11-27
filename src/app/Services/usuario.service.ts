import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../Interfaces/paged-response';
import { Response } from '../Interfaces/response';
import { Usuario } from '../Interfaces/usuario';
import { UsuarioModel } from '../Models/usuarioModel';
import { UsuarioUpdateModel } from '../Models/usuarioUpdateModel';
import { Login } from '../Interfaces/login';
import { Sesion } from '../Interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlApi:string = environment.endpoint + "Usuario/";
  constructor(private http:HttpClient) { }

  iniciarSesion(request:Login):Observable<Response<Sesion>>{

    return this.http.post<Response<Sesion>>(`${this.urlApi}IniciarSesion`, request);
  }

  listar():Observable<PagedResponse<Usuario>>{
    return this.http.get<PagedResponse<Usuario>>(`${this.urlApi}Listar`);
  }

  obtener(id:number):Observable<Response<Usuario>>{
    return this.http.get<Response<Usuario>>(`${this.urlApi}Obtener/${id}`);
  }

  guardar(request: UsuarioModel):Observable<Response<number>>{
    return this.http.post<Response<number>>(`${this.urlApi}Guardar`, request);
  }

  editar(request: UsuarioUpdateModel):Observable<Response<number>>{
    return this.http.put<Response<number>>(`${this.urlApi}Editar`, request);
  }

  eliminar(id:number):Observable<Response<number>>{
    return this.http.delete<Response<number>>(`${this.urlApi}Eliminar/${id}`);
  }
}
