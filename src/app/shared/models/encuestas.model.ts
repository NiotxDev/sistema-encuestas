// --------------- Interfaces Generales de la Encuesta y Cupones ---------------
export interface CuponInfo {
  idCupon: number;
  codigoCupon: string;
  descripcion: string;
  fechaExpiracion: Date | string; // ISO 8601 string
}
export interface Empresa {
  idEmpresa: number;
  nombre: string;
  logoUrl: string;
}
// Interfaz para la información general de una encuesta (usada en GET /api/Encuesta/Lista y como respuesta de POST /api/Encuesta)
export interface Encuesta {
  idEncuesta: number;
  titulo: string;
  descripcion: string;
  cuponInfo: CuponInfo | null; // Puede ser null si no hay cupón
  fechaCreacion: Date | string; // Puede ser Date si se parsea o string si se deja como viene
}

// Interfaz para los datos de la encuesta (sin las preguntas, solo info general)
// Esta interfaz es similar a 'Encuesta' pero podría usarse para subconjuntos de datos.
// Se mantiene porque fue proporcionada inicialmente, aunque 'Encuesta' es más completa.
export interface EncuestaInfo {
  idEncuesta: number;
  titulo: string;
  descripcion: string;
  cupon?: CuponInfo; // El cupón es opcional y puede venir directo con la info de la encuesta
  // Otras propiedades de la encuesta (ej. fecha creacion)
}
// --------------- Interfaces para Respuestas Predefinidas (Combos) y Opciones ---------------
// Nueva interfaz para las opciones de respuesta dentro de un ComboRespuesta (para GET /api/Encuesta/combo)
export interface ComboRespuestaOpcion {
  idRespuesta: number;
  texto: string; // Nota: el campo se llama 'texto' en el combo del backend
  orden: number;
}
// Interfaz para el "combo" de respuestas predefinidas (si tu API lo devuelve así)
export interface ComboRespuesta {
  idConjuntoRespuesta: number; // El ID que se enviará en PreguntaCreacionRequest
  nombre: string; // El nombre amigable para mostrar en el frontend (ej. "Valoración de servicio")
  respuestas: ComboRespuestaOpcion[]
}
// Interfaz general para una respuesta (usada en Pregunta para FormularioEncuestaGetResponse)
export interface Respuesta {
  idRespuesta: number;
  idConjuntoRespuesta: number;
  texto: string; // Nota: el campo se llama 'textoRespuesta' aquí
  orden: number;
}
// Interfaz para una opción de respuesta (Puede solaparse con ComboRespuestaOpcion o Respuesta,
// se mantiene por si tiene un uso distinto en tu API)
export interface OpcionRespuesta { // Nueva interfaz para las opciones del combo
  idRespuesta: number; // Coincide con idRespuesta de tu JSON
  textoRespuesta: string;
  idConjuntoRespuesta?: number;
  // ... otras propiedades de opción
}
// Interfaz para una pregunta (usada en FormularioEncuestaGetResponse)
export interface Pregunta {
  idPregunta: number;
  textoPregunta: string;
  orden: number;
  tipoPregunta: string;
  respuestas?: Respuesta[];
}
// --------------- Interfaces para la Creación de Encuestas por Empleado (POST /api/Encuesta) ---------------

// Interfaz para el objeto Cupon al crear una encuesta (si se incluye)
export interface CuponCreacionRequest {
  codigoCupon: string;
  descripcion: string;
  fechaExpiracion: string; // Debe ser un string en formato ISO 8601 (ej. "YYYY-MM-DDTHH:mm:ss.sssZ")
}

// Interfaz para una Pregunta al crear una encuesta (según el DTO del backend para POST)
export interface PreguntaCreacionRequest {
  textoPregunta: string;
  orden: number; // El orden de la pregunta (ej. 1, 2, 3...)
  idConjuntoRespuesta: number; // ID numérico del conjunto de respuestas predefinido (obtenido de ComboRespuesta)
  // NOTA IMPORTANTE: Para este POST, el backend NO espera un array de 'opciones' aquí.
  // Las opciones se definen mediante 'idConjuntoRespuesta'.
}

// Interfaz principal para el cuerpo de la solicitud POST a /api/Encuesta (creación de encuesta)
export interface EncuestaCreacionRequest {
  idEmpleado: number; // ID del empleado que crea la encuesta
  tituloEncuesta: string; // El título de la encuesta
  descripcion: string; // La descripción de la encuesta
  cupon?: CuponCreacionRequest | null; // El cupón es opcional y puede ser null
  preguntas: PreguntaCreacionRequest[]; // Array de preguntas a crear
}

//--------------Interfaces Para el Formulario de la Encuesta que va dirigido hacia el Cliente-------------//
// Modelos para el GET del formulario de encuesta para el cliente (GET /api/FormularioEncuesta/{idEnvioEncuesta})
export interface FormularioEncuestaGetResponse {
  idEnvioEncuesta: number;
  tituloEncuesta: string;
  descripcionEncuesta: string;
  empresa: Empresa;
  encuesta: {
    idEncuesta: number;
    titulo: string;
    descripcion: string;
    cupon: CuponInfo;
  };
  preguntas: Pregunta[];
}
// Modelos para el POST (lo que Angular enviará al backend)
export interface RespuestaClienteRequest {
  idPregunta: number;
  idConjuntoRespuesta?: number; // Opcional si solo aplica a ciertos tipos de preguntas
  idRespuestaElegida?: number; // Para preguntas de opción múltiple
  textoRespuestaAbierta?: string; // Para preguntas de texto libre
}
//Eso reemplaza a "EnviarRespuestasEncuestaRequest" 
export interface FormularioEncuestaPostRequest {
  idEncuesta: number;
  correoCliente: string;
  respuestas: RespuestaClienteRequest[];
}

// Respuesta del endpoint POST /api/FormularioEncuesta (si devuelve un cupón o mensaje)
export interface SubmitEncuestaResponse {
  message: string; // Mensaje de confirmación del backend
  cupon?: CuponInfo; // Si el backend explícitamente devuelve información del cupón al enviar la encuesta
  // Añade otras propiedades si el backend las envía
}
// Opcional pero recomendado: Define una interfaz para el usuario autenticado
export interface UserData {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  empresaId: number;
  empresaNombre: string;
  // El tipo de dato real de logoUrl si no es string, o si es la URL del logo
  // Puedes añadir un campo 'token' si tu backend devuelve un JWT u otro token de sesión
  token?: string;
}