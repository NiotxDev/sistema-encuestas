import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CrearEncuestaComponent } from './crear-encuesta/crear-encuesta.component';
import { SubirClientesComponent } from './subir-clientes/subir-clientes.component';
import { SubirCuponComponent } from './subir-cupon/subir-cupon.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [

  { path: '', redirectTo: 'crear-encuesta', pathMatch: 'full' },
  { path: 'crear-encuesta', component: CrearEncuestaComponent },
  { path: 'subir-clientes', component: SubirClientesComponent },
  { path: 'subir-cupon', component: SubirCuponComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadosRoutingModule { }
