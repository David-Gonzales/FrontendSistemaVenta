import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Response } from '../Interfaces/response';
import { Menu } from '../Interfaces/menu';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private urlApi:string = environment.endpoint + "Menu/";
  constructor(private http:HttpClient) {}

  listar():Observable<Response<Menu>>{
    return this.http.get<Response<Menu>>(`${this.urlApi}Listar`);
  }

  obtener(id:number):Observable<Response<Menu>>{
    return this.http.get<Response<Menu>>(`${this.urlApi}Obtener/${id}`);
  }
}
