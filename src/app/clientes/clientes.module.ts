import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ResponderEncuestaComponent } from './responder-encuesta/responder-encuesta.component';


@NgModule({
  declarations: [
    ResponderEncuestaComponent
    
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ClientesModule { }
