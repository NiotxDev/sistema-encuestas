import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Encuesta, ComboRespuesta, FormularioEncuestaGetResponse } from '../../shared/models/encuestas.model';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {
  // AJUSTA ESTA URL a la URL REAL DE TU API DE BACKEND PARA ENCUESTAS
  // Basado en tu Swagger UI, la base es http://localhost:5194 y la ruta es /api/Encuesta
  private apiUrl = 'http://localhost:5194/api/Encuesta';
  private apiFormularioUrl = 'http://localhost:5194/api/FormularioEncuesta'; // Añadimos la URL para FormularioEncuesta

  constructor(private http: HttpClient) { }
  /**
   * GET /api/Encuesta/combo
   * Trae data para el combo de selección de conjunto de respuestas predefinidas.
   */
  getEncuestaCombo(): Observable<ComboRespuesta[]> {
    return this.http.get<ComboRespuesta[]>(`${this.apiUrl}/combo`);
  
  }
  
  /**
   * GET /api/Encuesta/lista
   * Trae una lista de todas las encuestas creadas por el empleado.
   * Requiere el ID del empleado.
   */
  getEncuestasByEmpleadoId(idEmpleado: number): Observable<Encuesta[]> {
    // Asumiendo que tu API /lista espera el idEmpleado como query parameter
    return this.http.get<Encuesta[]>(`${this.apiUrl}/lista?idEmpleado=${idEmpleado}`);
  }

  /**
   * GET /api/Encuesta/{id}
   * Trae la información de una encuesta seleccionada.
   */
  getEncuestaById(id: number): Observable<Encuesta> {
    return this.http.get<Encuesta>(`${this.apiUrl}/${id}`);
  }

  /**
   * POST /api/Encuesta
   * Registra la nueva encuesta creada por el empleado.
   */
  createEncuesta(encuestaData: any): Observable<Encuesta> { // Puedes tipar 'encuestaData' si tienes un modelo para la creación
    return this.http.post<Encuesta>(this.apiUrl, encuestaData);
  }

  // Métodos para FormularioEncuesta (basado en tu Swagger UI)
  /**
   * GET /api/FormularioEncuesta
   * Trae la información de una encuesta específica para ser respondida por un cliente,
   * incluyendo preguntas y opciones.
   * Parámetros: idEnvioEncuesta (int), correoCliente (string)
   */
  getFormularioEncuesta(idEnvioEncuesta: number, correoCliente: string): Observable<FormularioEncuestaGetResponse> {
    return this.http.get<FormularioEncuestaGetResponse>(`${this.apiFormularioUrl}?idEnvioEncuesta=${idEnvioEncuesta}&correoCliente=${correoCliente}`);
  }

  /**
   * POST /api/FormularioEncuesta
   * Registra las respuestas de un cliente a una encuesta.
   * Requiere un objeto FormularioEncuestaPostRequest.
   */
  submitFormularioEncuesta(formData: any): Observable<any> { // Usar 'any' temporalmente o crear interfaz para el POST del formulario
    return this.http.post<any>(this.apiFormularioUrl, formData);
  }

  // Opcional: Si tu API permite actualizar o eliminar encuestas
  updateEncuesta(id: number, encuestaData: any): Observable<Encuesta> {
    return this.http.put<Encuesta>(`${this.apiUrl}/${id}`, encuestaData);
  }

  deleteEncuesta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
