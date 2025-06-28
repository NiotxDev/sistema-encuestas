// src/app/auth/auth-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthPageComponent } from './auth-page/auth-page.component';

const routes: Routes = [
  {
    path: '',  // Ruta base para el módulo de autenticación (ej. /login, /register)
    component: AuthPageComponent, // Este componente será el contenedor
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' } // Redirige la ruta base del AuthModule a login
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }