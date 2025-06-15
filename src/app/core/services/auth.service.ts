import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs'; // Importa 'of' para crear un observable
import { tap } from 'rxjs';

// Opcional pero recomendado: Define una interfaz para el usuario autenticado
export interface AuthenticatedUser {
  id: number;       // <-- ¡Añadimos el ID aquí!
  token: string;
  email: string;
  nombre?: string;
  // ... cualquier otra propiedad que tu API de login eventualmente devuelva y quieras almacenar
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // AJUSTA ESTA URL a la URL REAL DE TU API DE BACKEND PARA AUTENTICACIÓN
  // Por ejemplo: 'http://localhost:5000/api/auth' o 'https://tu-dominio.com/api/auth'
  private apiUrl = 'http://localhost:5194/api/Auth'; // Ajustado a un puerto común para .NET y '/api/Auth'

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  // Datos del usuario de prueba
  private TEST_USER: AuthenticatedUser = {
    id: 1, // Puedes cambiar este ID para simular diferentes empleados
    token: 'fake-jwt-token-para-desarrollo', // Un token falso
    email: 'empleado.prueba@ejemplo.com',
    nombre: 'antonio'
  };

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    let initialUser: any = {};
    // Comprueba si el código se está ejecutando en el navegador
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Solo intenta acceder a localStorage si estamos en el navegador
        const storedUser = localStorage.getItem('currentUser');
        initialUser = storedUser ? JSON.parse(storedUser) : {};
      } catch (e) {
        console.error('Error parsing stored user from localStorage:', e);
        // Manejar el error, quizás limpiar el localStorage si está corrupto
        localStorage.removeItem('currentUser');
      }
    }
    // Si no hay un usuario en localStorage, usa el usuario de prueba
    if (!initialUser && isPlatformBrowser(this.platformId)) {
      initialUser = this.TEST_USER;
      // Opcional: guardarlo en localStorage para que persista al recargar
      localStorage.setItem('currentUser', JSON.stringify(this.TEST_USER));
    }

    // Intenta cargar el usuario actual del localStorage al iniciar el servicio
    this.currentUserSubject = new BehaviorSubject<AuthenticatedUser | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthenticatedUser | null {
    return this.currentUserSubject.value;
  }

  // Este método 'login' ahora será una simulación si no hay un backend de login
  // En un entorno de desarrollo, siempre "logueará" al TEST_USER
  login(credentials: { email: string; password: string }): Observable<AuthenticatedUser> {
    // Si tu compañero implementa el login, aquí llamarías al backend real.
    // Por ahora, simulamos una respuesta exitosa
    console.warn('¡ATENCIÓN! Usando login simulado. Implementar backend de login real.');
    // Simula la respuesta exitosa del backend con el usuario de prueba
    const user = this.TEST_USER;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
    return of(user); // 'of' crea un Observable que emite el valor y se completa
  }

  logout() {
    // Eliminar el usuario de localStorage para cerrar sesión
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');  // Elimina el usuario del almacenamiento local
    }
    this.currentUserSubject.next(null); // Emite un valor nulo para indicar que no hay usuario logueado
  }

  // Opcional: para registrar nuevos usuarios
  register(userData: any): Observable<any> {
    // Esto es solo un placeholder, necesitarías un endpoint de registro real
    console.warn('¡ATENCIÓN! El registro no está implementado en el backend. Esta es una función de prueba.');
    return of({ message: 'Registro simulado exitoso' });
  }

}
