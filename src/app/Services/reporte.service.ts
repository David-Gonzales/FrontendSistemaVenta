import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResponse } from '../Interfaces/paged-response';
import { ReporteVentasPorFecha } from '../Interfaces/reporte-ventas-por-fecha';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private urlApi: string = environment.endpoint + "Reporte/";
  constructor(private http: HttpClient) { }

  VentasPorFecha(fechaInicio: string, fechaFin: string): Observable<PagedResponse<ReporteVentasPorFecha>>{

    return this.http.get<PagedResponse<ReporteVentasPorFecha>>(
      `${this.urlApi}VentasPorFecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }
}
