import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-grafico-respuestas',
  standalone: false,
  templateUrl: './grafico-respuestas.component.html',
  styleUrl: './grafico-respuestas.component.scss'
})
export class GraficoRespuestasComponent {

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {min:0}
    },
    plugins:{
      legend:{
        display: true,
        position: 'top'
      }
    }
  };
  
  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Encuesta 1','Encuesta 2','Encuesta 3'],
    datasets: [
      {data: [15, 28, 35], label: 'Respuestas Recibidas', backgroundColor: '#3f51b5'}
    ]
  };
  
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

}
