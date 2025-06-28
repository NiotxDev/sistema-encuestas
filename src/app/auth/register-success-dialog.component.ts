import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router'; // <--- Necesitas Router si vas a redirigir al cerrar el diálogo

@Component({
  standalone: false,
  templateUrl: './register-success-dialog.component.html',
  styleUrl: './register-success-dialog.component.scss',

  template:`
    <h2 mat-dialog-title>¡Registro Exitoso!</h2>
    <mat-dialog-content>
      ¡Te has registrado exitosamente! Ahora puedes iniciar sesión con tus nuevas credenciales.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
      <button mat-raised-button color="primary" (click)="onLoginClick()">Ir a Iniciar Sesión</button>
    </mat-dialog-actions>
  `,
  styles:[`
    mat-dialog-title {
      color: #4CAF50; /* Un verde para éxito */
      font-weight: bold;
    }
    mat-dialog-content {
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 1.1em;
      line-height: 1.5;
    }
  `
  ]
})
export class RegisterSuccessDialogComponent {
  constructor(public dialogRef: MatDialogRef<RegisterSuccessDialogComponent>, private router: Router) {}

  onLoginClick(): void {
    this.dialogRef.close(true); // Cierra el diálogo y envía 'true' para indicar que se redirija
  }
}
