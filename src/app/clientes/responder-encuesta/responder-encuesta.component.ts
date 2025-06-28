import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { EncuestasService } from '../../core/services/encuestas.service';
import {
  FormularioEncuestaGetResponse,
  Pregunta,
  CuponInfo,
  RespuestaClienteRequest,
  FormularioEncuestaPostRequest, // Para el POST final
  SubmitEncuestaResponse,
  Respuesta // Usamos 'Respuesta' para las opciones de preguntas
} from '../../shared/models/encuestas.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-responder-encuesta',
  standalone: false,
  templateUrl: './responder-encuesta.component.html',
  styleUrls: ['./responder-encuesta.component.scss']
})
export class ResponderEncuestaComponent implements OnInit, OnDestroy {

  idEnvioEncuesta: string | null = null;
  correoCliente: string | null = null;
  encuestaData: FormularioEncuestaGetResponse | null = null;
  clienteEncuestaForm: FormGroup;
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  showCuponPopup = false;
  cuponInfo: CuponInfo | null = null;

  private routeSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private encuestasService: EncuestasService,
    private fb: FormBuilder
  ) {
    this.clienteEncuestaForm = this.fb.group({
      correoCliente: ['', [Validators.required, Validators.email]],
      preguntasRespuestas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParams.subscribe((params) => {
      this.idEnvioEncuesta = params['idEnvioEncuesta'];
      this.correoCliente = params['correoCliente'];

      if (this.correoCliente) {
        this.clienteEncuestaForm.get('correoCliente')?.setValue(this.correoCliente);
      }

      if (this.idEnvioEncuesta && this.correoCliente) {
        this.loadEncuestaParaCliente(this.idEnvioEncuesta, this.correoCliente);
      } else {
        this.errorMessage = 'Faltan parámetros para cargar la encuesta. Por favor, asegúrese de tener un enlace válido.';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  get preguntasRespuestas(): FormArray {
    return this.clienteEncuestaForm.get('preguntasRespuestas') as FormArray;
  }

  loadEncuestaParaCliente(idEnvio: string, correo: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.encuestasService
      .getFormularioEncuestaParaCliente(parseInt(idEnvio, 10), correo)
      .subscribe({
        next: (data: FormularioEncuestaGetResponse) => {
          this.encuestaData = data;
          this.isLoading = false;
          this.buildPreguntasFormArray(data.preguntas);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al cargar la encuesta:', err);
          this.errorMessage = 'No se pudo cargar la encuesta. Por favor, intente de nuevo.';
          this.isLoading = false;
        },
      });
  }

  /**
   * Construye dinámicamente el FormArray para las respuestas de las preguntas.
   * INFIERE EL TIPO DE PREGUNTA SI NO VIENE DEL BACKEND.
   * @param preguntas Array de objetos Pregunta.
   */
  buildPreguntasFormArray(preguntas: Pregunta[]): void {
    while (this.preguntasRespuestas.length !== 0) {
      this.preguntasRespuestas.removeAt(0);
    }

    if (this.encuestaData && this.encuestaData.preguntas) {
      this.encuestaData.preguntas.forEach((pregunta) => {
        // === INICIO DEL CAMBIO IMPORTANTE ===
        // Si el backend no envía 'tipoPregunta', lo inferimos.
        // Si tiene respuestas, asumimos que es 'multiple-choice'.
        // Si no tiene respuestas (ej. para texto libre puro), asumimos 'text'.
        // IDEALMENTE: TU BACKEND DEBE ENVIAR 'tipoPregunta'.
        if (!pregunta.tipoPregunta) {
          pregunta.tipoPregunta = (pregunta.respuestas && pregunta.respuestas.length > 0) ? 'multiple-choice' : 'text';
          console.warn(`DEBUG: 'tipoPregunta' no recibido del backend para la pregunta ID ${pregunta.idPregunta}. Asumiendo tipo: '${pregunta.tipoPregunta}'`);
        }
        // === FIN DEL CAMBIO IMPORTANTE ===

        const isTextType = pregunta.tipoPregunta === 'text';

        this.preguntasRespuestas.push(
          this.fb.group({
            idPregunta: [pregunta.idPregunta],
            idRespuestaElegida: [''],
            textoRespuestaAbierta: [''],
          })
        );
      });
    }
  }

  onSelectOption(preguntaIndex: number, opcionId: number): void {
    const preguntaGroup = this.preguntasRespuestas.at(preguntaIndex) as FormGroup;
    const control = preguntaGroup.get('idRespuestaElegida');
    if (control) {
      control.setValue(opcionId);
      control.markAsTouched();
    }
  }

  onTextChange(preguntaIndex: number, event: Event): void {
    const preguntaGroup = this.preguntasRespuestas.at(preguntaIndex) as FormGroup;
    const control = preguntaGroup.get('textoRespuestaAbierta');
    if (control) {
      control.setValue((event.target as HTMLInputElement).value);
      control.markAsTouched();
    }
  }

  submitEncuesta(): void {
    this.clienteEncuestaForm.markAllAsTouched();
    this.errorMessage = null;
    this.successMessage = null;
    this.cuponInfo = null;
    this.showCuponPopup = false;

    // Validación manual para asegurar que todas las preguntas obligatorias tengan respuesta
    let allQuestionsAnswered = true;
    this.preguntasRespuestas.controls.forEach((preguntaGroup: AbstractControl, index: number) => {
      const formGroupControl = preguntaGroup as FormGroup;
      const originalPregunta = this.encuestaData!.preguntas[index];

      // Si el tipo es multiple-choice o rating, verificar que se haya seleccionado una opción
      if (originalPregunta.tipoPregunta === 'multiple-choice' || originalPregunta.tipoPregunta === 'rating') {
        if (!formGroupControl.get('idRespuestaElegida')?.value) {
          allQuestionsAnswered = false;
          formGroupControl.get('idRespuestaElegida')?.setErrors({ 'required': true });
        }
      }
      // Si el tipo es texto, verificar que no esté vacío (si lo consideras obligatorio)
      else if (originalPregunta.tipoPregunta === 'text') {
        if (!formGroupControl.get('textoRespuestaAbierta')?.value || formGroupControl.get('textoRespuestaAbierta')?.value.trim() === '') {
          allQuestionsAnswered = false;
          formGroupControl.get('textoRespuestaAbierta')?.setErrors({ 'required': true });
        }
      }
    });

    if (this.clienteEncuestaForm.invalid || !allQuestionsAnswered) {
      this.errorMessage = 'Por favor, responde todas las preguntas obligatorias y completa el correo.';
      return;
    }

    if (!this.encuestaData || !this.idEnvioEncuesta || !this.correoCliente) {
      this.errorMessage = 'Error interno: datos de la encuesta o del cliente no disponibles.';
      return;
    }
    this.isLoading = true;

    const respuestasParaEnviar: RespuestaClienteRequest[] = [];

    this.preguntasRespuestas.controls.forEach((preguntaGroup: AbstractControl, index: number) => {
      const formGroupControl = preguntaGroup as FormGroup;
      const originalPregunta = this.encuestaData!.preguntas[index]; // Usar encuestaData
      const tipoPregunta = originalPregunta.tipoPregunta;

      const respuestaCliente: RespuestaClienteRequest = {
        idPregunta: originalPregunta.idPregunta,
      };

      if (tipoPregunta === 'multiple-choice' || tipoPregunta === 'rating') {
        const idRespuestaElegida = formGroupControl.get('idRespuestaElegida')?.value;
        if (idRespuestaElegida) {
          respuestaCliente.idRespuestaElegida = idRespuestaElegida;
          // Si el backend necesita idConjuntoRespuesta aquí, asegúrate de que esté disponible en originalPregunta.respuestas
          // Y que se obtenga correctamente de la opción seleccionada.
          const opcionSeleccionada = originalPregunta.respuestas?.find(r => r.idRespuesta === idRespuestaElegida);
          if (opcionSeleccionada) {
            respuestaCliente.idConjuntoRespuesta = opcionSeleccionada.idConjuntoRespuesta;
          }
        }
      } else if (tipoPregunta === 'text') {
        const textoRespuestaAbierta = formGroupControl.get('textoRespuestaAbierta')?.value;
        if (textoRespuestaAbierta) {
          respuestaCliente.textoRespuestaAbierta = textoRespuestaAbierta;
        }
      }
      // Añade más 'else if' para otros tipos de pregunta si los tienes

      respuestasParaEnviar.push(respuestaCliente);
    });

    const requestData: FormularioEncuestaPostRequest = {
      idEncuesta: this.encuestaData.encuesta.idEncuesta,
      correoCliente: this.correoCliente!,
      respuestas: respuestasParaEnviar,
    };

    console.log('Payload de respuestas a enviar:', requestData);

    this.encuestasService.submitFormularioEncuesta(requestData).subscribe({
      next: (response: SubmitEncuestaResponse) => {
        console.log('Encuesta enviada exitosamente:', response);
        this.isLoading = false;
        this.successMessage = response.message || '¡Encuesta enviada con éxito! Gracias por tu participación.';

        if (response && response.cupon) {
            this.cuponInfo = response.cupon;
        } else if (this.encuestaData?.encuesta.cupon) {
            this.cuponInfo = this.encuestaData.encuesta.cupon;
        } else {
            this.cuponInfo = null;
        }

        this.showCuponPopup = true;
        this.clienteEncuestaForm.disable();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al enviar la encuesta:', err);
        this.isLoading = false;
        if (err.status === 400 && err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error && err.error.errors) {
          const errors = Object.values(err.error.errors).flat();
          this.errorMessage = errors.join('; ');
        } else {
          this.errorMessage = 'Hubo un error al enviar tu encuesta. Por favor, intenta de nuevo.';
        }
      },
    });
  }

  closeCuponPopup(): void {
    this.showCuponPopup = false;
    this.clienteEncuestaForm.reset();
    this.preguntasRespuestas.clear();
    this.encuestaData = null;
    this.cuponInfo = null;
    this.successMessage = null;
    this.errorMessage = null;
    this.isLoading = true;

    this.router.navigate(['/gracias-por-responder']);
  }
}
