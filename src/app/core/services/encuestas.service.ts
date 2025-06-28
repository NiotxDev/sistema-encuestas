import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; //Para la URl de la Base
import {Encuesta, ComboRespuesta, 
  SubmitEncuestaResponse, EncuestaCreacionRequest, 
  FormularioEncuestaGetResponse, 
  FormularioEncuestaPostRequest, } from '../../shared/models/encuestas.model';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {

  // Las URLs base para los controladores de Encuesta y FormularioEncuesta
  // Asegúrate de que `environment.apiUrl` apunte a la base de tu API (ej: 'http://localhost:5194/api')
  private encuestaApiBaseUrl = `${environment.apiUrl}/Encuesta`;
  private formularioEncuestaApiBaseUrl = `${environment.apiUrl}/FormularioEncuesta`;

  constructor( private http: HttpClient) { }

    /**
   * GET /api/Encuesta/Lista
   * Trae una lista de todas las encuestas creadas por un empleado específico.
   * Requiere el ID del empleado como query parameter.
   * @param idEmpleado El ID del empleado cuyas encuestas se desean obtener.
   * @returns Un Observable que emite un array de objetos Encuesta.
   */
  getEncuestasPorEmpleado(idEmpleado: number): Observable<Encuesta[]> {
    let params = new HttpParams().set('idEmpleado', idEmpleado.toString());
    // NOTA: La autenticación (envío del token JWT en la cabecera Authorization)
    // debe ser manejada por un HTTP Interceptor en Angular.
    // Sin él, esta llamada probablemente fallará con un 401 Unauthorized si la API lo requiere.
    return this.http.get<Encuesta[]>(`${this.encuestaApiBaseUrl}/Lista`, { params: params });
  }

  // --- Métodos Futuros (o ya definidos en tu servicio anterior) ---

  /**
   * GET /api/Encuesta/combo
   * Trae data para el combo de selección de conjunto de respuestas predefinidas.
   * @returns Un Observable que emite un array de objetos ComboRespuesta.
   */
  getEncuestaCombo(): Observable<ComboRespuesta[]> {
    return this.http.get<ComboRespuesta[]>(`${this.encuestaApiBaseUrl}/combo`);
  }

  /**
   * GET /api/Encuesta/{id}
   * Trae la información de una encuesta seleccionada por su ID.
   * @param id El ID de la encuesta a obtener.
   * @returns Un Observable que emite un objeto Encuesta.
   */
  getEncuestaById(idEncuesta: number): Observable<Encuesta> {
    return this.http.get<Encuesta>(`${this.encuestaApiBaseUrl}/${idEncuesta}`);
  }

  /**
   * POST /api/Encuesta
   * Registra la nueva encuesta creada por el empleado.
   * @param encuestaData Los datos de la encuesta a crear.
   * @returns Un Observable que emite el objeto Encuesta creado.
   */
  createEncuesta(encuestaData: EncuestaCreacionRequest): Observable<Encuesta> {
    return this.http.post<Encuesta>(this.encuestaApiBaseUrl, encuestaData);
  }

  /**
   * PUT /api/Encuesta/{id}
   * Actualiza una encuesta existente.
   * @param id El ID de la encuesta a actualizar.
   * @param encuestaData Los datos actualizados de la encuesta.
   * @returns Un Observable que emite el objeto Encuesta actualizado.
   */
  updateEncuesta(id: number, encuestaData: Encuesta): Observable<Encuesta> {
    return this.http.put<Encuesta>(`${this.encuestaApiBaseUrl}/${id}`, encuestaData);
  }

  /**
   * DELETE /api/Encuesta/{id}
   * Elimina una encuesta por su ID.
   * @param id El ID de la encuesta a eliminar.
   * @returns Un Observable que emite la respuesta del servidor.
   */
  deleteEncuesta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.encuestaApiBaseUrl}/${id}`);
  }

 /**
   * GET /api/FormularioEncuesta/{idEnvioEncuesta}
   * Obtiene los detalles de un formulario de encuesta específico para que un cliente pueda responderlo.
   * @param idEnvioEncuesta El ID del envío de la encuesta.
   * @returns Un Observable que emite un objeto FormularioEncuestaGetResponse.
   */
  getFormularioEncuestaParaCliente(idEnvioEncuesta: number, correoCliente: string): Observable<FormularioEncuestaGetResponse> {
    let params = new HttpParams()
      .set('idEnvioEncuesta', idEnvioEncuesta.toString())
      .set('correoCliente', correoCliente);
    // La URL base ya incluye /api/FormularioEncuesta, solo añadimos los parámetros
    return this.http.get<FormularioEncuestaGetResponse>(this.formularioEncuestaApiBaseUrl, { params: params });
  }

  /**
   * POST /api/FormularioEncuesta
   * Registra las respuestas de un cliente a una encuesta.
   * @param formData Los datos del formulario de respuesta (FormularioEncuestaPostRequest).
   * @returns Un Observable que emite la respuesta del servidor.
   */
  submitFormularioEncuesta(respuestasData: FormularioEncuestaPostRequest): Observable<SubmitEncuestaResponse> {
    return this.http.post<SubmitEncuestaResponse>(this.formularioEncuestaApiBaseUrl, respuestasData);
  }
  // Puedes añadir más métodos aquí según necesites (PUT/DELETE para encuestas, etc.)
  
}
