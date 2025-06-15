import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NgChartsModule  } from 'ng2-charts'

import { EmpleadosRoutingModule } from './empleados-routing.module';
import { CrearEncuestaComponent } from './crear-encuesta/crear-encuesta.component';
import { SubirClientesComponent } from './subir-clientes/subir-clientes.component';
import { SubirCuponComponent } from './subir-cupon/subir-cupon.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TarjetasResumenComponent } from './dashboard/tarjetas-resumen/tarjetas-resumen.component';
import { GraficoRespuestasComponent } from './dashboard/grafico-respuestas/grafico-respuestas.component';
import { TopRespuestasComponent } from './dashboard/top-respuestas/top-respuestas.component';
import { EstadoEncuestaComponent } from './dashboard/estado-encuesta/estado-encuesta.component';
import { FuentesClientesComponent } from './dashboard/fuentes-clientes/fuentes-clientes.component';
import { ResumenFechasComponent } from './dashboard/resumen-fechas/resumen-fechas.component';
import { ListaEncuestasComponent } from './lista-encuestas/lista-encuestas.component';


@NgModule({
  declarations: [
    CrearEncuestaComponent,
    SubirClientesComponent,
    SubirCuponComponent,
    DashboardComponent,
    TarjetasResumenComponent,
    GraficoRespuestasComponent,
    TopRespuestasComponent,
    EstadoEncuestaComponent,
    FuentesClientesComponent,
    ResumenFechasComponent,
    ListaEncuestasComponent
  ],
  imports: [
    CommonModule,
    EmpleadosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    NgChartsModule
  ]
})
export class EmpleadosModule { }
