// Importaciones Necesarias
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-encuesta',
  standalone: false,
  templateUrl: './crear-encuesta.component.html',
  styleUrl: './crear-encuesta.component.scss',
})
export class CrearEncuestaComponent {
  encuestaForm: FormGroup;
  tiposRespuesta = ['Opción Múltiple', 'Respuesta Única', 'Texto Abierto'];

  constructor(private fb: FormBuilder) {
    this.encuestaForm = this.fb.group({
      titulo: ['', Validators.required],
      preguntas: this.fb.array([]),
    });
  }
  get preguntas(): FormArray {
    return this.encuestaForm.get('preguntas') as FormArray;
  }

  nuevaPregunta(): FormGroup {
    return this.fb.group({
      texto: ['', Validators.required],
      tipo: ['Opción Múltiple', Validators.required],
      opciones: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
    });
  }

  agregarPregunta() {
    this.preguntas.push(this.nuevaPregunta());
  }

  eliminarPregunta(index: number) {
    this.preguntas.removeAt(index);
  }

  agregarOpcion(preguntaIndex: number) {
    const opciones = this.preguntas
      .at(preguntaIndex)
      .get('opciones') as FormArray;
    opciones.push(this.fb.control('', Validators.required));
  }

  eliminarOpcion(preguntaIndex: number, opcionIndex: number) {
    const opciones = this.preguntas
      .at(preguntaIndex)
      .get('opciones') as FormArray;
    opciones.removeAt(opcionIndex);
  }

  enviarEncuesta() {
    if (this.encuestaForm.valid) {
      const datos = this.encuestaForm.value;
      console.log('Encuesta enviada:', datos);
      // Aquí se puede usar un servicio para guardar la encuesta
    } else {
      console.log('Formulario no válido');
    }
  }
  getOpciones(preguntaIndex: number): FormArray {
    return this.preguntas.at(preguntaIndex).get('opciones') as FormArray;
  }
}
