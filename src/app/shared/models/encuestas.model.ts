// src/app/shared/models/encuestas.model.ts

export interface Empresa {
  idEmpresa: number;
  nombre: string;
  logoUrl: string;
}

export interface CuponInfo {
  idCupon: number;
  codigoCupon: string;
  descripcion: string;
  fechaExpiracion: string; // ISO 8601 string
}

export interface Encuesta {
  idEncuesta: number;
  titulo: string;
  descripcion: string;
  cupon: CuponInfo | null; // Puede ser null si no hay cupón
  fechaCreacion: Date;
}

export interface RespuestaPregunta {
  idConjuntoRespuesta: number;
  texto: string;
  orden: number;
  idRespuesta: number;
}

export interface Pregunta {
  idPregunta: number;
  textoPregunta: string;
  orden: number;
  respuestas: RespuestaPregunta[];
}

export interface OpcionRespuestaCombo { // Nueva interfaz para las opciones del combo
  idRespuesta: number; // Coincide con idRespuesta de tu JSON
  texto: string;
  orden: number;
  // ... otras propiedades de opción
}

// Interfaz para el "combo" de respuestas predefinidas (si tu API lo devuelve así)
export interface ComboRespuesta {
  idConjuntoRespuesta: number; // Coincide con idConjuntoRespuesta de tu JSON
  nombre: string;
  opciones: OpcionRespuestaCombo[]; // <-- ¡Cambiado a 'repuestas' para coincidir con el typo del backend!
}

// Modelos para el GET
export interface FormularioEncuestaGetResponse {
  empresa: Empresa;
  encuesta: Encuesta;
  preguntas: Pregunta[];
}

// Modelos para el POST (lo que Angular enviará al backend)
export interface RespuestaClienteRequest {
  idPregunta: number;
  idConjuntoRespuesta: number;
  idRespuestaElegida: number; // Este es el ID de la respuesta seleccionada por el cliente
}

export interface FormularioEncuestaPostRequest {
  idEncuesta: number;
  correoCliente: string;
  respuestas: RespuestaClienteRequest[];
}