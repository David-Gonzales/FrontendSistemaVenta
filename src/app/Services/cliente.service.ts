import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../Interfaces/paged-response';
import { Response } from '../Interfaces/response';
import { Cliente } from '../Interfaces/cliente';
import { ClienteModel } from '../Models/clienteModel';
import { ClienteUpdateModel } from '../Models/clienteUpdateModel';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlApi:string = environment.endpoint + "Cliente/";
  constructor(private http:HttpClient) { }

  listar():Observable<PagedResponse<Cliente>>{
    return this.http.get<PagedResponse<Cliente>>(`${this.urlApi}Listar`);
  }

  obtener(id:number):Observable<Response<Cliente>>{
    return this.http.get<Response<Cliente>>(`${this.urlApi}Obtener/${id}`);
  }

  tieneVentas(id:number):Observable<Response<boolean>>{
    return this.http.get<Response<boolean>>(`${this.urlApi}TieneVentas?id=${id}`);
  }

  guardar(request: ClienteModel):Observable<Response<number>>{
    return this.http.post<Response<number>>(`${this.urlApi}Guardar`, request);
  }

  editar(request: ClienteUpdateModel):Observable<Response<number>>{
    return this.http.put<Response<number>>(`${this.urlApi}Editar`, request);
  }

  eliminar(id:number):Observable<Response<number>>{
    return this.http.delete<Response<number>>(`${this.urlApi}Eliminar?id=${id}`);
  }
}
