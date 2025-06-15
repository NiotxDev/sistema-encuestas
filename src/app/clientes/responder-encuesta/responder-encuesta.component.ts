import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestasService } from '../../core/services/encuestas.service';
import { FormularioEncuestaGetResponse, Pregunta, CuponInfo ,RespuestaClienteRequest } from '../../shared/models/encuestas.model';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl, AbstractControl} from '@angular/forms';


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

  //Variables del Pop-Up con respecto al cupon
  showCuponPopup = false; //Controlla su visibilidad
  cuponInfo: CuponInfo | null = null; //Almacenará los datos del cupon a mostrar


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
  
  submitEncuesta(): void {
    this.encuestaForm.markAllAsTouched();
    if (this.encuestaForm.invalid) {
      this.error = 'Por favor, responde todas las preguntas.';
      return;
    }

    if (!this.formularioEncuesta) {
      this.error = 'No se ha cargado la encuesta para enviar.';
      return;
    }
    //Columna vertebral del envio de respuestas
    const respuestasParaEnviar: RespuestaClienteRequest[] = [];

    this.preguntasFormArray.controls.forEach((preguntaGroup: AbstractControl, index: number) => {
      const formValue = preguntaGroup.value;
      const originalPregunta = this.formularioEncuesta!.preguntas[index];

      if (formValue.respuestaElegida) {
        const selectedOption = originalPregunta.respuestas.find(
          (res) => res.idRespuesta === formValue.respuestaElegida
        );

        if (selectedOption) {
          respuestasParaEnviar.push({
            idPregunta: formValue.idPregunta,
            idConjuntoRespuesta: selectedOption.idConjuntoRespuesta,
            idRespuestaElegida: formValue.respuestaElegida,
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
        //alert('Encuesta enviada exitosamente. ¡Gracias!');
        //Mostramos el PopUp
        // 1. Asignar el cupón si existe 
        if (this.formularioEncuesta?.encuesta.cupon) {
          this.cuponInfo = this.formularioEncuesta.encuesta.cupon;
        } else {
          this.cuponInfo = null;
        }
        //Mostramos el PopUp
        this.showCuponPopup= true;
        // Opcional: Podrías redirigir después de un tiempo o al cerrar el pop-up
        // setTimeout(() => {
        //   this.router.navigate(['/gracias-por-responder']);
        // }, 5000); // Redirige después de 5 segundos
      },
      error: (err) => {
        console.error('Error al enviar la encuesta:', err);
        this.error =
          'Hubo un error al enviar tu encuesta. Por favor, intenta de nuevo.';
      },
    });
  }
  // Nuevo método para cerrar el pop-up y redirigir
  closeCuponPopup(): void {
    this.showCuponPopup = false;
    // Opcional: Limpia el formulario. Aunque la redirección lo limpiaría al cargar de nuevo,
    // esto asegura que el estado interno del formulario se resetee inmediatamente.
    this.encuestaForm.reset();
    this.router.navigate(['/gracias-por-responder']); // Redirige a la página de agradecimiento
  }
}
