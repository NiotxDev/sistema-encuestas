// src/app/auth/auth.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Importa esto
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthPageComponent } from './auth-page/auth-page.component'; // Si tienes uno
import { RegisterComponent } from './register/register.component';
import { RegisterSuccessDialogComponent } from './register-success-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AuthPageComponent,
    LoginComponent,
    RegisterComponent,
    RegisterSuccessDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // Añade esto a los imports
    AuthRoutingModule,
    MatDialogModule
  ],
  exports: [
  ]
})
export class AuthModule { }