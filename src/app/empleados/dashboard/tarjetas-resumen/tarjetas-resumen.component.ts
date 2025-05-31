import { Component } from '@angular/core';

@Component({
  selector: 'app-tarjetas-resumen',
  standalone: false,
  templateUrl: './tarjetas-resumen.component.html',
  styleUrl: './tarjetas-resumen.component.scss'
})
export class TarjetasResumenComponent {
  kpis = [
    {
      icon: 'assignment',
      label: 'Encuestas creadas',
      value: 12,
      color: '#3f51b5'
    },
    {
      icon: 'group',
      label: 'Clientes invitados',
      value: 75,
      color: '#009688'
    },
    {
      icon: 'how_to_vote',
      label: 'Respuestas recibidas',
      value: 58,
      color: '#4caf50'
    },
    {
      icon: 'hourglass_empty',
      label: 'Sin respuesta',
      value: 17,
      color: '#f44336'
    }
  ];
}
