import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../Interfaces/paged-response';
import { Response } from '../Interfaces/response';
import { Transaccion } from '../Interfaces/transaccion';
import { TransaccionModel } from '../Models/transaccionModel';
import { TransaccionUpdateModel } from '../Models/transaccionUpdateModel';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {

  private urlApi:string = environment.endpoint + "Transaccion/";
  constructor(private http:HttpClient) { }

  listar():Observable<PagedResponse<Transaccion>>{
    return this.http.get<PagedResponse<Transaccion>>(`${this.urlApi}Listar`);
  }

  obtener(id:number):Observable<Response<Transaccion>>{
    return this.http.get<Response<Transaccion>>(`${this.urlApi}Obtener/${id}`);
  }

  guardar(request: TransaccionModel):Observable<Response<number>>{
    return this.http.post<Response<number>>(`${this.urlApi}Guardar`, request);
  }

  editar(request: TransaccionUpdateModel):Observable<Response<number>>{
    return this.http.put<Response<number>>(`${this.urlApi}Editar`, request);
  }

  eliminar(id:number):Observable<Response<number>>{
    return this.http.delete<Response<number>>(`${this.urlApi}Eliminar/${id}`);
  }
}
