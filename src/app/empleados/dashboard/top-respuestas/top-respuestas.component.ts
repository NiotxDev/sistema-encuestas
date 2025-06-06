import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ChartOptions, ChartData} from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-top-respuestas',
  standalone: false,
  templateUrl: './top-respuestas.component.html',
  styleUrl: './top-respuestas.component.scss'
})
export class TopRespuestasComponent {

  public horizontalBarChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y', //Esto lo vuelve Horizontal
    plugins: {
      legend: { display: false},
      title: { display:true, text: 'Top Respuestas Seleccionadas'}
    }
  };
  public horizontalBarChartType: 'bar' = 'bar';

  public horizontalBarChartData: ChartData<'bar'> = {
    labels: ['Excelente','Buena','Regular','Mala'],
    datasets:[
      {
        label: 'Número de Votos',
        data: [35, 20, 8, 2],
        backgroundColor: [
          '#4caf50',
          '#2196f3',
          '#ffc107',
          '#f44336'
        ]
      }
    ]
  };
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

}
