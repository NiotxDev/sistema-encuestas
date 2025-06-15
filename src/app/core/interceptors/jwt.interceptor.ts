import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Añadir el token de autenticación del usuario si está disponible
    const currentUser = this.authService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    // AJUSTA ESTA URL a la URL BASE de tu API de backend (sin el /api/Auth o /api/empleados)
    // Por ejemplo: 'http://localhost:5194' o 'https://tu-dominio.com'
    const isApiUrl = request.url.startsWith('http://localhost:5194/api'); // Ajustado a tu puerto común

    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    return next.handle(request);
  }
}
