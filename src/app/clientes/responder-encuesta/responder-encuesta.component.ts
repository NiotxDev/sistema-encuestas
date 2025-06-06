import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-responder-encuesta',
  standalone: false,
  templateUrl: './responder-encuesta.component.html',
  styleUrl: './responder-encuesta.component.scss'
})
export class ResponderEncuestaComponent implements OnInit{
  formulario!: FormGroup;
  preguntas: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient){}

  ngOnInit(): void {
    this.http.get<any[]>('/api/FormularioEncuesta').subscribe(preguntas => {
      this.preguntas = preguntas;
      this.crearFormulario();
    });
  }

  crearFormulario() {
    const grupoPreguntas = this.preguntas.map(p => this.fb.control(''));
    this.formulario = this.fb.group({
      respuestas: this.fb.array(grupoPreguntas)
    });
  }
  get respuestasFormArray(){
    return this.formulario.get('respuestas') as FormArray;
  }
    enviar() {
    const payload = {
      idEncuesta: 0,
      correoCliente: 'cliente@email.com', // reemplazar con valor real
      respuestas: this.preguntas.map((p, index) => ({
        idPregunta: p.idPregunta,
        idConjuntoRespuesta: 0,
        idRespuestaElegida: this.respuestasFormArray.at(index).value
      }))
    };

    this.http.post('/api/FormularioEncuesta', payload).subscribe(resp => {
      console.log('Enviado con éxito', resp);
    });
  }

}
