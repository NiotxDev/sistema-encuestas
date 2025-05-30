import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { GraficoRespuestasComponent } from './grafico-respuestas/grafico-respuestas.component';
import { TopRespuestasComponent } from './top-respuestas/top-respuestas.component';
import { EstadoEncuestaComponent } from './estado-encuesta/estado-encuesta.component';
import { FuentesClientesComponent } from './fuentes-clientes/fuentes-clientes.component';
import { ResumenFechasComponent } from './resumen-fechas/resumen-fechas.component';



@NgModule({
  declarations: [
    DashboardComponent,
    GraficoRespuestasComponent,
    TopRespuestasComponent,
    EstadoEncuestaComponent,
    FuentesClientesComponent,
    ResumenFechasComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
