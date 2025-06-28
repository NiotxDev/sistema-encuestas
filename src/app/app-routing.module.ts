import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard'; // Importa el AuthGuard
import { DashboardComponent } from './empleados/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full' // Redirige la raíz a login
  },
  {
    path: '', // Aquí puedes tener un segmento de ruta para tu módulo de autenticación, ej. 'auth'
    loadChildren: () => import('./auth/auth.module').then(m =>m.AuthModule)
  },
  {
    path: 'dashboard',
    component: DashboardComponent, canActivate: [AuthGuard]
  },
  {
    path: 'empleados',
    loadChildren: () => import('./empleados/empleados.module').then(m => m.EmpleadosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'clientes',
    loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/empleados/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/empleados/dashboard'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
