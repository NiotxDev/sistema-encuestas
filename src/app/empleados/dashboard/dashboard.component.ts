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
    ngOnInit(): void {
    // Obtener la información del usuario al inicializar el componente
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userName = currentUser.nombre || currentUser.correo; // Usa el nombre si existe, si no, el email
      // Si tu backend devuelve una URL de avatar:
      // this.userAvatarUrl = currentUser.avatarUrl || 'assets/default-user-avatar.png';
      // Por ahora, usa una imagen por defecto si no tienes una URL dinámica
      this.userAvatarUrl = 'profile.png'; // O 'assets/default-user-avatar.png' //ESTABLECER UNA IMAGEN AQUI
    } else {
      // Manejar el caso si no hay usuario logueado (aunque el AuthGuard debería evitar esto)
      this.userName = 'Invitado';
      this.userAvatarUrl = 'assets/default-user-avatar.png'; // Una imagen predeterminada
    }
  }

  logout() {
    this.authService.logout(); // Llama al método logout del servicio
    this.router.navigate(['/login']); // Redirige al login
  }
}
