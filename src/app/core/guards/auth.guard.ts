import { Injectable } from '@angular/core';
import { CanActivate,  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Usamos el getter currentUserValue del servicio
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      // Usuario autenticado, permite el acceso a la ruta
      return true;
    }

    // No autenticado, redirige a la página de login con un parámetro de retorno (opcional)
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
