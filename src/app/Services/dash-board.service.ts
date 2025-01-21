import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashBoard } from '../Interfaces/dash-board';
import { Response } from '../Interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {

  private urlApi:string = environment.endpoint + "DashBoard/";
  constructor(private http:HttpClient) { }

  resumen(): Observable<Response<DashBoard>>{
    return this.http.get<Response<DashBoard>>(`${this.urlApi}Resumen`);
  }
}
