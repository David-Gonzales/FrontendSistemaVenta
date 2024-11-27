import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../Interfaces/paged-response';
import { Response } from '../Interfaces/response';
import { HistorialVenta } from '../Interfaces/historial-venta';
import { VentaModel } from '../Models/ventaModel';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private urlApi:string = environment.endpoint + "Venta/";
  constructor(private http:HttpClient) { }

  listar():Observable<PagedResponse<HistorialVenta>>{
    return this.http.get<PagedResponse<HistorialVenta>>(`${this.urlApi}Listar`);
  }

  guardar(request: VentaModel):Observable<Response<number>>{
    return this.http.post<Response<number>>(`${this.urlApi}Guardar`, request);
  }
}
