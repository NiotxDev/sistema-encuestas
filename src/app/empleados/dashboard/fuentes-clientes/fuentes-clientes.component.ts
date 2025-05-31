import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-fuentes-clientes',
  standalone: false,
  templateUrl: './fuentes-clientes.component.html',
  styleUrl: './fuentes-clientes.component.scss'
})
export class FuentesClientesComponent {
  public doughnutChartType: 'doughnut'= 'doughnut'; //Pequenio error ya resuelto

  public doughnutChartData: ChartData<'doughnut'> = {
      labels: ['Facebook', 'Instagram', 'Referidos', 'Web'],
      datasets: [
        {
          data: [35, 25, 20, 20],
          backgroundColor: ['#3b5998', '#E1306C', '#4caf50', '#ff9800'],
        }
      ]
    };
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display:true,
        text: 'Distribucion por fuente'
      }
    }
  };

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}
