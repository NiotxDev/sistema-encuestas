import { Component } from '@angular/core';

@Component({
  selector: 'app-estado-encuesta',
  standalone: false,
  templateUrl: './estado-encuesta.component.html',
  styleUrl: './estado-encuesta.component.scss'
})
export class EstadoEncuestaComponent {
  estado = {
    encuestasCreadas: 12,
    respuestasRecibidas: 37,
    clientesPendientes: 8
  };

}
