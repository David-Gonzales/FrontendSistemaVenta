import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Response } from '../Interfaces/response';
import { Observable } from 'rxjs';
import { Rol } from '../Interfaces/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private urlApi:string = environment.endpoint + "Rol/";
  constructor(private http:HttpClient) { }

  listar():Observable<Response<Rol>>{
    return this.http.get<Response<Rol>>(`${this.urlApi}Listar`);
  }

  obtener(id:number):Observable<Response<Rol>>{
    return this.http.get<Response<Rol>>(`${this.urlApi}Obtener/${id}`);
  }
}
