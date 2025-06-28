import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, AbstractControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService, RegisterData } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterSuccessDialogComponent } from '../register-success-dialog.component';
//import { HttpClient } from '@angular/common/http'; // Solo si el logo se sube por separado o necesitas otras llamadas HTTP

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;
  loading = false;
  error = '';
  errorMessage: string | null = null;
  //selectedFile: File | null = null; // Para el archivo del logo // Si manejas subida de archivo para el logo

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
    //private http: HttpClient // Inyecta HttpClient si vas a subir el logo por separado
  ){}

  ngOnInit(): void {
    this.initForm();
  }

  // Validador personalizado para que la contraseña y su confirmación coincidan
  // Es mejor definirlo fuera de la clase o como un método estático/una función exportada
  // para que no haya problemas con 'this'. Ya te lo había sugerido así.
  // Si lo defines aquí, debería ser una función de flecha o usar .bind(this) si accedes a propiedades de la clase.
  // Pero lo más limpio es como función exportada:
  // export function passwordsMatchValidator(): ValidatorFn { ... }
  // O, si lo mantienes como método de la clase, así:
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('contrasena');
    const confirmPassword = control.get('confirmarContrasena');

    if (!password || !confirmPassword) {
      return null;
    }

    // Asegúrate de que este validador se aplique al FormGroup, no a un control individual
    return password.value !== confirmPassword.value
      ? { 'passwordsMismatch': true } // Usamos 'passwordsMismatch' como la clave del error
      : null;
  };

  // Nuevo método para inicializar o resetear el formulario
  initForm():void {
    this.registerForm = this.formBuilder.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]], // Mínimo 6 caracteres para contraseña
      confirmarContrasena: ['', Validators.required],
      nombreEmpresa: ['', Validators.required],
      logoUrl: ['', [Validators.required, Validators.pattern('(https?://.*\\.(?:png|jpg|jpeg|gif|svg))')]] // <--- CAMBIO CLAVE: logoUrl AHORA ES REQUERIDO Y CON VALIDACIÓN DE URL/FORMATO DE IMAGEN
    }, { validator: this.passwordMatchValidator }); // Validador personalizado para confirmar contraseña
  }

  // Conveniencia para acceder fácilmente a los controles del formulario
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.errorMessage = null;
    this.loading = true;

    // Detener si el formulario es inválido
    if (this.registerForm.invalid) {
       this.registerForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
      // La lógica de errores específica de contraseña ya no es necesaria aquí si usas mat-error en el HTML
      // y la validación a nivel de grupo.
      // this.error = 'Por favor, completa todos los campos requeridos.'; // Este mensaje genérico.
      this.loading = false; // Asegurarse de que loading se pone a false si el formulario es inválido
      return;
    }
    
    // La data que envías desde el formulario (RegisterData)
    const userDataFrontend: RegisterData = {
      nombreCompleto: this.f['nombreCompleto'].value,
      correo: this.f['correo'].value,
      contrasena: this.f['contrasena'].value,
      nombreEmpresa: this.f['nombreEmpresa'].value,
      logoUrl: this.f['logoUrl'].value 
    };

    // La lógica para `logoUrl` del backend:
    // Tu Swagger muestra 'logoUrl': 'string' como parte del cuerpo POST.
    // Esto sugiere que el backend espera una URL de string directamente en el payload de registro,
    // o que acepta un placeholder "string" si el logo se sube en otro momento o es opcional.
    // Si necesitas subir una imagen real, la lógica sería diferente (FormData en AuthService o una llamada separada).
    // Por ahora, el AuthService se encarga de añadir "string" al `logoUrl` del payload del backend.

    this.authService.register(userDataFrontend).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Registro Existoso', response)
        this.loading = false;

        // Limpiar campos del formulario
        this.initForm();

        // Opcional: Si quieres que las validaciones se reinicien completamente
        // Object.keys(this.registerForm.controls).forEach(key => {
        //   this.registerForm.get(key)?.setErrors(null);
        // });

        // Abrir el popup de éxito
        const dialogRef = this.dialog.open(RegisterSuccessDialogComponent, {
          width: '400px', // Ancho del diálogo
          disableClose: true // Impide que el usuario cierre el diálogo haciendo clic fuera
        });

        // Suscribirse al cierre del diálogo
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) { // Si el usuario hizo clic en "Ir a Iniciar Sesión"
            this.router.navigate(['/login']);
          } else { // Si el usuario hizo clic en "Cerrar" (mat-dialog-close)
            // No redirigir automáticamente, se queda en la página de registro
            // o podrías redirigir a /login de todos modos si ese es el comportamiento deseado
            this.router.navigate(['/login']); // Redirigir al login incluso si solo cierra
          }
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error durante el registro:', err);
        // Manejo de errores específicos del backend
        if (err.status === 400 && err.error) {
          if (err.error.errors) { // Errores de validación de modelo de ASP.NET Core
            this.error = Object.values(err.error.errors).flat().join('; ');
          } else if (typeof err.error === 'string') {
            this.error = err.error; // Si el backend envía un mensaje de error plano
          } else {
            this.error = 'Datos de registro inválidos. Por favor, verifica la información.';
          }
        } else if (err.status === 409) { // Por ejemplo, si el correo ya está registrado
          this.error = 'El correo electrónico ya está registrado. Por favor, usa otro.';
        } else {
          this.error = 'Ocurrió un error al intentar registrarte. Por favor, inténtalo de nuevo.';
        }
      }
    });
  }

 
  // Método para navegar al componente de login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
