import { Component } from '@angular/core';

@Component({
  selector: 'app-tarjetas-resumen',
  standalone: false,
  templateUrl: './tarjetas-resumen.component.html',
  styleUrl: './tarjetas-resumen.component.scss'
})
export class TarjetasResumenComponent {
  totalEncuestas = 25;
  totalRespuestas = 18;
  porcentajeParticipacion = Math.round((this.totalRespuestas / this.totalEncuestas) * 100);
}
