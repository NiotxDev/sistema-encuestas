import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'; // Importa el AuthGuard
import { LoginComponent } from './auth/login/login.component'; // Importa el componente de Login
import { DashboardComponent } from './empleados/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent, canActivate: [authGuard]
  },
  {
    path: 'empleados',
    loadChildren: () => import('./empleados/empleados.module').then(m => m.EmpleadosModule),
    canActivate: [authGuard]
  },
  {
    path: 'clientes',
    loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule),
    canActivate: [authGuard]
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
