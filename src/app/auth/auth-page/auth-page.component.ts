import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-page',
  standalone: false,
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent implements OnInit, OnDestroy {
  currentRoute: string = '';
  private routerSubscription: Subscription | undefined;
  isLoginRoute: boolean = false;
  isRegisterRoute: boolean = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Escucha los eventos de navegación para saber cuándo la ruta cambia
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects; // Obtiene la URL completa después de redirecciones
    });

    // Establece la ruta inicial en caso de que la página se cargue directamente en una ruta de auth
    this.currentRoute = this.router.url;
  }
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Métodos para determinar la página actual
  isLoginPage(): boolean {
    // Comprueba si la URL actual incluye '/login'
    return this.currentRoute.includes('/login');
  }

  isRegisterPage(): boolean {
    // Comprueba si la URL actual incluye '/register'
    return this.currentRoute.includes('/register');
  }
}
