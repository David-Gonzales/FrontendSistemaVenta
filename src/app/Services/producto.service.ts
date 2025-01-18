import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PagedResponse } from '../Interfaces/paged-response';
import { Producto } from '../Interfaces/producto';
import { ProductoConEstado } from '../Interfaces/producto-con-estado';
import { Observable } from 'rxjs';
import { Response } from '../Interfaces/response';
import { ProductoModel } from '../Models/productoModel';
import { ProductoUpdateModel } from '../Models/productoUpdateModel';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlApi:string = environment.endpoint + "Producto/";
  constructor(private http:HttpClient) { }

  listar():Observable<PagedResponse<Producto>>{
    return this.http.get<PagedResponse<Producto>>(`${this.urlApi}Listar`);
  }

  listarProductosEstados():Observable<Response<ProductoConEstado>>{
    return this.http.get<Response<ProductoConEstado>>(`${this.urlApi}ListarProductosEstados`);
  }

  obtener(id:number):Observable<Response<Producto>>{
    return this.http.get<Response<Producto>>(`${this.urlApi}Obtener?id=${id}`);
  }

  guardar(request: ProductoModel):Observable<Response<number>>{
    return this.http.post<Response<number>>(`${this.urlApi}Guardar`, request);
  }

  editar(request: ProductoUpdateModel):Observable<Response<number>>{
    return this.http.put<Response<number>>(`${this.urlApi}Editar`, request);
  }

  eliminar(id:number):Observable<Response<number>>{
    return this.http.delete<Response<number>>(`${this.urlApi}Eliminar?id=${id}`);
  }
}
