import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; // Importa 'of' para crear un observable
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';


// Interfaz para las credenciales de login que envías
export interface LoginCredentials {
  correo: string;
  contrasena: string; // El backend espera un campo para la contraseña
}

// Opcional pero recomendado: Define una interfaz para el usuario autenticado
export interface UserData {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  empresaId: number;
  empresaNombre: string;
  // El tipo de dato real de logoUrl si no es string, o si es la URL del logo
  // Puedes añadir un campo 'token' si tu backend devuelve un JWT u otro token de sesión
  // token?: string;
}

// Interfaz para los datos de registro que envías
export interface RegisterData {
  nombreCompleto: string;
  correo: string;
  contrasena: string; // La contraseña en texto plano para el registro
  confirmarContrasena?: string; // Solo para validación en frontend, no se envía al backend
  nombreEmpresa: string;
  logoUrl: string;
}

export interface RegisterResponse {
  message?: string; // Ejemplo: "Usuario registrado exitosamente"
  userId: number;
  // O si devuelve los datos del usuario registrado:
  // id?: number;
  // email?: string;
  // ...
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // AJUSTA ESTA URL a la URL REAL DE TU API DE BACKEND PARA AUTENTICACIÓN
  private apiUrl = environment.apiUrl // 'http://localhost:5194/api'

  private currentUserSubject: BehaviorSubject<UserData | null>;
  public currentUser: Observable<UserData | null>; // Observable para que otros se suscriban
  
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    // Lee el usuario de localStorage al iniciar el servicio
    let initialUser: UserData | null = null;

    // Solo intenta leer de localStorage si estamos en un entorno de navegador
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          initialUser = JSON.parse(storedUser);
        } catch (e) {
          console.error('Error parsing stored user from localStorage', e);
          localStorage.removeItem('currentUser'); // Limpiar datos corruptos
          initialUser = null;
        }
    }
   }
    this.currentUserSubject = new BehaviorSubject<UserData | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable(); // Convierte a Observable público
  // --- NUEVO: Getter para obtener el valor actual del usuario sin suscribirse ---
  }

  public get currentUserValue(): UserData | null {return this.currentUserSubject.value;}
  /**
   * Método de inicio de sesión. Envía credenciales al backend y maneja la respuesta.
   * @param credentials Objeto con email y password.
   * @returns Observable de UserData (ahora con el token).
   */
  login(credentials: LoginCredentials): Observable<UserData> {
    // El payload que tu backend espera: email y password
    const payload = {email: credentials.correo, password: credentials.contrasena};
    return this.http.post<UserData>(`${this.apiUrl}/Login/iniciar-sesion`, payload)
    .pipe(
        // Al recibir la respuesta exitosa, actualiza el BehaviorSubject y localStorage
        // map(user => { // Usar map si necesitas transformar la respuesta antes de guardarla
        //   this.saveUser(user);
        //   return user;
        // })
        // Si no necesitas transformar, simplemente doOnSuccess para actualizar y luego el tap
        tap(user => {
          // Guardar el usuario completo (incluyendo el token) en localStorage
          this.saveUser(user);
          // Emitir el usuario actualizado a todos los suscriptores
          this.currentUserSubject.next(user);
          console.log('Usuario logueado y guardado:', user);
        })
      );
  }
   
  /**
   * Método para registrar un nuevo usuario.
   * @param userDataFrontend Datos del usuario para registrar.
   * @returns Observable de RegisterResponse.
   */
  register(userDataFrontend: RegisterData): Observable<RegisterResponse> {
    // El payload que tu backend espera para registrar: nombreCompleto, email, password, empresa, logoUrl
    const payload = {
      nombreCompleto: userDataFrontend.nombreCompleto,
      email: userDataFrontend.correo, // Mapea 'correo' del frontend a 'email' del backend
      password: userDataFrontend.contrasena, // Mapea 'contrasena' del frontend a 'password' del backend
      empresa: userDataFrontend.nombreEmpresa.toString(), // Asumo que idEmpresa del frontend es un número,                              
      logoUrl: userDataFrontend.logoUrl // Por ahora, tal como tu Swagger indica.
      // Si luego subes un logo, esta lógica cambiará.
    };
    return this.http.post<RegisterResponse>(`${this.apiUrl}/Login/registrar`, payload);
  }
  /**
   * Guarda los datos del usuario (y el token) en localStorage.
   * @param user Los datos del usuario a guardar.
   */
  public saveUser(user: UserData): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    // Si tu API devuelve un token (ej. JWT), lo guardarías aquí también:
    // localStorage.setItem('authToken', user.token);
  }
  /**
   * Recupera los datos del usuario logueado.
   * @returns Los datos del usuario o null si no hay ninguno.
   */
  getCurrentUser(): UserData | null {
    return this.currentUserSubject.value;
  }
  /**
   * Obtiene el ID del empleado logueado.
   * @returns El ID del empleado o null si no está logueado.
   */
  getLoggedInEmployeeId(): number | null {
    const currentUser = this.currentUserSubject.value;
    // Asegúrate de que currentUser.id exista y sea un número.
    // Si tu backend devuelve el ID como string, podrías necesitar parseInt(currentUser.id, 10).
    return currentUser ? currentUser.id : null;
  }
  
  /**
   * Verifica si el usuario está logueado basándose en la existencia de datos de usuario en localStorage.
   */
  isLoggedIn(): boolean {
    // Un usuario se considera logueado si tenemos información de currentUserSubject
    return this.currentUserSubject.value !== null;
    //return this.currentUserSubject.value != null;
  }
  /**
   * Cierra la sesión del usuario.
   * Elimina los datos del usuario de localStorage y del BehaviorSubject.
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      // Si guardabas el token por separado: localStorage.removeItem('authToken');
    }
    this.currentUserSubject.next(null);
    console.log('Usuario ha cerrado sesión.');
  }

}
