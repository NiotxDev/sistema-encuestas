import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../../core/services/auth.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      // Los nombres de los controles del formulario coinciden con tu interfaz LoginCredentials
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });

    // Redirigir a la página principal/dashboard si ya está logueado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/empleados/dashboard']); // Redirige a tu dashboard principal
    }
  }

  // Conveniencia para un fácil acceso a los campos del formulario
  get f() { return this.loginForm.controls; }
  
  // Método llamado al enviar el formulario
  onSubmit() {
    this.submitted = true;
    this.error = ''; // Limpiar cualquier mensaje de error previo

    // Detener aquí si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;  // Indicar que la operación está en curso
    // Aquí, `credentials` ya tiene 'correo' y 'contrasena'
    // El AuthService se encarga de mapearlos a 'email' y 'password' para el backend
    const credentials: LoginCredentials = {
      correo: this.f['correo'].value,
      contrasena: this.f['contrasena'].value
    };

    this.authService.login(credentials).subscribe({
      next: (user) => {
        // Login exitoso, redirigir al dashboard
        console.log('Login exitoso:', user);
        this.authService.saveUser(user); // Guarda los datos del usuario en localStorage
        this.router.navigate(['/empleados/dashboard']); // Asegúrate de que esta sea la ruta correcta
      },
      error: (err) => {
        console.error('Error durante el login:', err);
        // Puedes agregar lógica para mensajes de error más específicos
        if (err.status === 401) { // 401 Unauthorized
          this.error = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
        } else {
          this.error = 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
        }
        this.loading = false;
      }
    });
  }

  // Método para navegar al componente de registro
  goToRegister(): void {
    this.router.navigate(['/register']); // Ruta a tu componente de registro
  }

}
