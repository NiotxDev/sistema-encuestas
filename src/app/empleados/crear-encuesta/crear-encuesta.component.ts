// Importaciones Necesarias
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncuestasService } from '../../core/services/encuestas.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { EncuestaCreacionRequest, PreguntaCreacionRequest, 
  ComboRespuesta, // Para mapear tipos de pregunta a idConjuntoRespuesta
  CuponCreacionRequest, //Si decides añadir campos de cupón al formulario 
  UserData
 } from '../../shared/models/encuestas.model';
@Component({
  selector: 'app-crear-encuesta',
  standalone: false,
  templateUrl: './crear-encuesta.component.html',
  styleUrl: './crear-encuesta.component.scss',
})
export class CrearEncuestaComponent implements OnInit {
  encuestaForm: FormGroup;
  comboRespuestas: ComboRespuesta[] = []; // Almacenará los datos de /api/Encuesta/combo
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentEmployeeId: number | null = null; // Para almacenar el ID del empleado logueado

  constructor(
    private fb: FormBuilder,
    private encuestasService: EncuestasService,
    private router: Router,
    private authService: AuthService
  ) {
    this.encuestaForm = this.fb.group({
      idEmpleado: [null, Validators.required], // Se llenará con currentEmployeeId
      tituloEncuesta: ['', Validators.required], // Coincide con el backend
      descripcion: ['', Validators.required], // Añadido campo de descripción
      // Si quieres añadir campos para el cupón en el formulario, descomenta y ajusta:
      // cupon: this.fb.group({
      //   codigoCupon: ['', Validators.required],
      //   descripcion: ['', Validators.required],
      //   fechaExpiracion: ['', Validators.required] // Usar un control de fecha adecuado
      // }),
      preguntas: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadComboRespuestas(); // Cargar los tipos de respuesta del backend
    this.getCurrentEmployeeId(); // Obtener el ID del empleado
    this.agregarPregunta(); // Añadir una pregunta inicial por defecto
  }

  // Obtiene el ID del empleado logueado y lo asigna al formulario
  getCurrentEmployeeId(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.currentEmployeeId = currentUser.id, 10;
      this.encuestaForm.get('idEmpleado')?.setValue(this.currentEmployeeId); // Asigna el ID al campo del formulario
    } else {
      this.errorMessage = 'No se pudo obtener el ID del empleado. Por favor, inicie sesión.';
      console.error('ID de empleado no disponible.');
      // Opcional: Redirigir al login si no hay ID
      // this.router.navigate(['/login']);
    }
  }

  // Carga los tipos de respuesta predefinidos desde el backend (GET /api/Encuesta/combo)
  loadComboRespuestas(): void {
    this.encuestasService.getEncuestaCombo().subscribe({
      next: (data: ComboRespuesta[]) => {
        this.comboRespuestas = data;
        console.log('Combos de respuesta cargados:', this.comboRespuestas);
      },
      error: (err) => {
        console.error('Error al cargar combos de respuesta:', err);
        this.errorMessage = 'No se pudieron cargar los tipos de pregunta.';
      }
    });
  }

  // Mapea el nombre del tipo de pregunta (frontend) a su idConjuntoRespuesta (backend)
  getComboRespuesta(nombreTipo: string): ComboRespuesta | undefined {
    return this.comboRespuestas.find(c => c.nombre === nombreTipo);
  }

  get preguntas(): FormArray {
    return this.encuestaForm.get('preguntas') as FormArray;
  }

  nuevaPregunta(): FormGroup {
    return this.fb.group({
      textoPregunta: ['', Validators.required],
      // El tipo de pregunta será un nombre (string) del combo, que luego mapearemos a idConjuntoRespuesta
      tipoPreguntaNombre: ['Valoración de servicio', Validators.required], // Valor por defecto
      // NOTA CRÍTICA: El FormArray 'opciones' se mantiene aquí para la UI del frontend
      // pero sus valores NO se enviarán en el POST a /api/Encuesta.
      // Si necesitas mostrar las opciones predefinidas al usuario, lo harás en el HTML
      // basándote en el 'tipoPreguntaNombre' seleccionado.
      // Las opciones personalizadas NO se envían en este POST.
    });
  }

  agregarPregunta() {
    this.preguntas.push(this.nuevaPregunta());
  }

  eliminarPregunta(index: number) {
    this.preguntas.removeAt(index);
  }

  // ELIMINADOS: Los métodos agregarOpcion() y eliminarOpcion() ya no son necesarios
  // porque las opciones son predefinidas por el backend.
  /*
  agregarOpcion(preguntaIndex: number) {
    const opciones = this.preguntas.at(preguntaIndex).get('opciones') as FormArray;
    opciones.push(this.fb.control('', Validators.required));
  }
  eliminarOpcion(preguntaIndex: number, opcionIndex: number) {
    const opciones = this.preguntas.at(preguntaIndex).get('opciones') as FormArray;
    opciones.removeAt(opcionIndex);
  }
  getOpciones(preguntaIndex: number): FormArray {
    return this.preguntas.at(preguntaIndex).get('opciones') as FormArray;
  }
  */

  /**
   * Maneja el envío del formulario para crear una nueva encuesta.
   * Construye el objeto de solicitud según la estructura exacta del backend.
   */
  enviarEncuesta() {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.encuestaForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar validaciones

    if (this.encuestaForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios y corrige los errores.';
      this.isLoading = false;
      return;
    }

    if (this.currentEmployeeId === null) {
      this.errorMessage = 'ID de empleado no disponible. No se puede crear la encuesta.';
      this.isLoading = false;
      return;
    }

    const formValue = this.encuestaForm.value;

    // Construye el array de preguntas para enviar al backend
    const preguntasParaEnviar: PreguntaCreacionRequest[] = formValue.preguntas.map((p: any, index: number) => {
      const comboSeleccionado = this.getComboRespuesta(p.tipoPreguntaNombre);

      if (!comboSeleccionado) {
        this.errorMessage = `Tipo de pregunta "${p.tipoPreguntaNombre}" no válido o no encontrado para la pregunta ${index + 1}.`;
        this.isLoading = false;
        throw new Error(this.errorMessage); // Detiene la ejecución si el tipo no es válido
      }

      const preguntaRequest: PreguntaCreacionRequest = {
        textoPregunta: p.textoPregunta,
        orden: index + 1, // El orden de la pregunta (empezando desde 1)
        idConjuntoRespuesta: comboSeleccionado.idConjuntoRespuesta, // Mapea el nombre del combo a su ID
      };
      // Las opciones que el usuario 've' en el frontend (si las mostramos) NO se envían aquí.
      return preguntaRequest;
    });

    // Construye el objeto de la encuesta principal para enviar al backend
    const encuestaData: EncuestaCreacionRequest = {
      idEmpleado: this.currentEmployeeId,
      tituloEncuesta: formValue.tituloEncuesta,
      descripcion: formValue.descripcion,
      // Si tienes un formulario para el cupón y el backend lo espera aquí:
      // cupon: formValue.cupon, // Asegúrate de que formValue.cupon coincida con CuponCreacionRequest
      preguntas: preguntasParaEnviar,
    };

    console.log('Payload a enviar al backend:', encuestaData); // Para depuración

    // Llama al servicio para crear la encuesta
    this.encuestasService.createEncuesta(encuestaData).subscribe({
      next: (response) => {
        console.log('Encuesta creada exitosamente:', response);
        this.successMessage = '¡Encuesta creada con éxito!';
        this.isLoading = false;
        this.encuestaForm.reset(); // Limpia el formulario
        this.preguntas.clear(); // Limpia el FormArray de preguntas
        this.agregarPregunta(); // Añade una pregunta vacía para empezar de nuevo
        setTimeout(() => {
          this.router.navigate(['/empleados/encuestas/lista']);
        }, 2000); // Redirige después de 2 segundos
      },
      error: (err) => {
        console.error('Error al crear la encuesta:', err);
        this.isLoading = false;
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error && err.error.errors) {
          this.errorMessage = Object.values(err.error.errors).flat().join('; ');
        } else {
          this.errorMessage = 'Ocurrió un error al crear la encuesta. Por favor, inténtalo de nuevo.';
        }
      },
    });
  }
}