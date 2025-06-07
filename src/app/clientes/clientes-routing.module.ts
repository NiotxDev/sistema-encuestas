import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResponderEncuestaComponent } from './responder-encuesta/responder-encuesta.component';

const routes: Routes = [
  // { path: '', redirectTo: 'responder', pathMatch: 'full' },
  { path: 'responder-encuesta', component: ResponderEncuestaComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
