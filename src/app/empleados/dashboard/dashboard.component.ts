import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Asegúrate de la ruta

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  totalEncuestas = 10;
  respuestas = 7;
  // Variables para el nombre y avatar dinámicos
  userName: string | null = null;
  userAvatarUrl: string | null = null; // Si tienes una URL de avatar en tu backend


  get noResponden() {
    return this.totalEncuestas - this.respuestas;
  }
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  logout() {
    this.authService.logout(); // Llama al método logout del servicio
    this.router.navigate(['/login']); // Redirige al login
  }

  ngOnInit(): void {}
}
