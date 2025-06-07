import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestasService } from '../../core/services/encuestas.service';
import { FormularioEncuestaGetResponse, Pregunta, RespuestaClienteRequest } from '../../shared/models/encuestas.model';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-responder-encuesta',
  standalone: false,
  templateUrl: './responder-encuesta.component.html',
  styleUrl: './responder-encuesta.component.scss'
})
export class ResponderEncuestaComponent implements OnInit{
  formularioEncuesta: FormularioEncuestaGetResponse | null = null;
  encuestaForm: FormGroup;
  idEnvioEncuesta: string | null = null;
  correoCliente: string | null = null;
  isLoading = true;
  error: string | null = null;
  // Para almacenar las respuestas seleccionadas temporalmente
  respuestasSeleccionadas: { [idPregunta: number]: number } = {};

  constructor(private route: ActivatedRoute,
    private router: Router,
    private encuestasService: EncuestasService,
    private fb: FormBuilder){
      // Inicializa el FormGroup aquí o en ngOnInit si los datos iniciales dependen de algo
    this.encuestaForm = this.fb.group({
      preguntas: this.fb.array([]), // FormArray para las preguntas
    });
    }

    ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.idEnvioEncuesta = params['idEnvioEncuesta'];
      this.correoCliente = params['correoCliente'];

      if (this.idEnvioEncuesta && this.correoCliente) {
        this.cargarEncuesta();
      } else {
        this.error = 'Faltan parámetros para cargar la encuesta.';
        this.isLoading = false;
      }
    });
  }

  cargarEncuesta(): void {
    this.isLoading = true;
    this.error = null;
    this.encuestasService
      .getFormularioEncuesta(this.idEnvioEncuesta!, this.correoCliente!)
      .subscribe({
        next: (data) => {
          this.formularioEncuesta = data;
          this.isLoading = false;
          this.initializeForm(); // Inicializar el formulario después de cargar los datos
        },
        error: (err) => {
          console.error('Error al cargar la encuesta:', err);
          this.error = 'No se pudo cargar la encuesta. Por favor, intente de nuevo.';
          this.isLoading = false;
        },
      });
  }
  // Getter para acceder al FormArray de preguntas en el template
  get preguntasFormArray(): FormArray {
    return this.encuestaForm.get('preguntas') as FormArray;
  }
  initializeForm(): void {
      if (this.formularioEncuesta && this.formularioEncuesta.preguntas) {
      this.formularioEncuesta.preguntas.forEach((pregunta) => {
        this.preguntasFormArray.push(
          this.fb.group({
            idPregunta: [pregunta.idPregunta],
            // Agrega un control para la respuesta elegida (ej. un FormControl para el radio button)
            respuestaElegida: ['', Validators.required],
          })
        );
      });
    }
  }
  
  // Método para manejar la selección de una respuesta (radio button)
  onRespuestaChange(idPregunta: number, idRespuestaElegida: number): void {
    this.respuestasSeleccionadas[idPregunta] = idRespuestaElegida;
  }
  // Método para verificar si una respuesta está seleccionada
  isRespuestaSelected(idPregunta: number, idRespuesta: number): boolean {
    return this.respuestasSeleccionadas[idPregunta] === idRespuesta;
  }
  submitEncuesta(): void {
    if (this.encuestaForm.invalid) {
      this.error = 'Por favor, responde todas las preguntas.';
      this.encuestaForm.markAllAsTouched(); // Marca todos los controles como 'touched' para mostrar errores
      return;
    }

    if (!this.formularioEncuesta) {
      this.error = 'No se ha cargado la encuesta para enviar.';
      return;
    }
    const respuestasParaEnviar: RespuestaClienteRequest[] = [];
    this.formularioEncuesta.preguntas.forEach(pregunta => {
        const respuestaElegida = this.respuestasSeleccionadas[pregunta.idPregunta];
        if (respuestaElegida) {
            // Encuentra la respuesta en el conjunto de respuestas de la pregunta
            const conjuntoRespuesta = pregunta.respuestas.find(r => r.idRespuesta === respuestaElegida);
            if (conjuntoRespuesta) {
                respuestasParaEnviar.push({
                    idPregunta: pregunta.idPregunta,
                    idConjuntoRespuesta: conjuntoRespuesta.idConjuntoRespuesta, // O el que corresponda
                    idRespuestaElegida: respuestaElegida,
                });
            }
        }
    });


    const requestData = {
      idEncuesta: this.formularioEncuesta.encuesta.idEncuesta,
      correoCliente: this.correoCliente!,
      respuestas: respuestasParaEnviar,
    };

    this.encuestasService.postRespuestasEncuesta(requestData).subscribe({
      next: (response) => {
        alert('Encuesta enviada exitosamente. ¡Gracias!');
        this.router.navigate(['/gracias-por-responder']); // Redirigir a una página de agradecimiento
      },
      error: (err) => {
        console.error('Error al enviar la encuesta:', err);
        this.error =
          'Hubo un error al enviar tu encuesta. Por favor, intenta de nuevo.';
      },
    });
  }
}
