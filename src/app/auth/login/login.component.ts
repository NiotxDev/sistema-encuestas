import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent  implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string | null = null; // Para redirigir al usuario a la URL que intentaba acceder

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Redirigir a la página principal/dashboard si ya está logueado
    if (this.authService.currentUserValue && this.authService.currentUserValue.token) {
      this.router.navigate(['/dashboard']); // Redirige a tu dashboard principal
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Obtener la URL de retorno de los query params si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard'; // Por defecto al dashboard
  }
  // Conveniencia para un fácil acceso a los campos del formulario
  get f() { return this.loginForm.controls; }

    onSubmit() {
    this.submitted = true;

    // Detener aquí si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value)
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]); // Redirigir a la URL original o al dashboard
        },
        error: error => {
          console.error('Error de login:', error);
          this.error = 'Credenciales inválidas. Por favor, intenta de nuevo.';
          // Puedes refinar el mensaje de error según el error.status (ej. 401 para credenciales inválidas)
          if (error.status === 401) {
            this.error = 'Email o contraseña incorrectos.';
          } else {
            this.error = 'Hubo un error al iniciar sesión. Intenta de nuevo más tarde.';
          }
          this.loading = false;
        }
      });
  }

}
