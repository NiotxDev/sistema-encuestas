import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; //Para la URl de la Base
import { FormularioEncuestaGetResponse, FormularioEncuestaPostRequest } from '../../shared/models/encuestas.model';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {

  private apiUrl = `${environment.apiUrl}/FormularioEncuesta`; // Asegúrate de que environment.apiUrl esté configurado
  constructor( private http: HttpClient) { }
  getFormularioEncuesta(
    idEnvioEncuesta: string,
    correoCliente: string
  ): Observable<FormularioEncuestaGetResponse>{
    let params = new HttpParams();
    params = params.append('idEnvioEncuesta', idEnvioEncuesta);
    params = params.append('correoCliente', correoCliente);
    return this.http.get<FormularioEncuestaGetResponse>(this.apiUrl, {params});
  }

  postRespuestasEncuesta(
    data: FormularioEncuestaPostRequest
  ): Observable<any>{
    return this.http.post(this.apiUrl, data);
  }
}
