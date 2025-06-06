import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-resumen-fechas',
  standalone: false,
  templateUrl: './resumen-fechas.component.html',
  styleUrl: './resumen-fechas.component.scss'
})
export class ResumenFechasComponent {

  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins:{
      legend: { position: 'top'},
      title: { display: true, text: 'Resumen por Fechas'}
    }
  };
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: ['2025-05-25', '2025-05-26', '2025-05-27', '2025-05-28', '2025-05-29'],
    datasets: [
      {
        label: 'Encuestas Creadas',
        data: [12, 19, 8, 15, 11],
        backgroundColor: 'rgba(63, 81, 181, 0.6)'
      },
      {
        label: 'Respuestas Recibidas',
        data: [5, 14, 6, 12, 9],
        backgroundColor: 'rgba(76, 175, 80, 0.6)'
      }
    ]
  };
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}
