import { Component, OnInit } from '@angular/core';
import { EncuestasService } from '../services/encuestas.service';
import { AuthService } from '../../core/services/auth.service';
import { Encuesta } from '../../shared/models/encuestas.model'; // <-- Asegúrate de usar la interfaz correcta

@Component({
  selector: 'app-lista-encuestas',
  standalone: false,
  templateUrl: './lista-encuestas.component.html',
  styleUrl: './lista-encuestas.component.scss'
})
export class ListaEncuestasComponent {
  encuestas: Encuesta[] = []; // Usa la interfaz si la tienes, si no, any[]
  loading = true;
  error = '';
  idEmpleado: number | null = null; // Para almacenar el ID del empleado logueado

  constructor(
    private encuestasService: EncuestasService,
    private authService: AuthService // Inyecta el servicio de autenticación
  ) { }

  ngOnInit(): void {
    // Obtener el ID del empleado logueado
    const currentUser = this.authService.currentUserValue;
    // Asume que tu objeto de usuario logueado (currentUser) tiene una propiedad 'id'
    // que corresponde al idEmpleado necesario para la API /lista
    if (currentUser && currentUser.id) {
      this.idEmpleado = currentUser.id;
      this.getEncuestasByEmpleado();
    } else {
      this.error = 'No se pudo obtener el ID del empleado logueado. Asegúrate de que el token JWT contenga el ID del usuario.';
      this.loading = false;
    }
  }

  getEncuestasByEmpleado(): void {
    if (this.idEmpleado === null) {
      this.error = 'ID de empleado no disponible para cargar encuestas.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.encuestasService.getEncuestasByEmpleadoId(this.idEmpleado)
      .subscribe({
        next: (data) => {
          this.encuestas = data;
          this.loading = false;
          this.error = '';
        },
        error: (err) => {
          console.error('Error al obtener encuestas:', err);
          this.error = 'Error al cargar las encuestas. Inténtalo de nuevo más tarde.';
          this.loading = false;
        }
      });
  }
    // Método para cuando se quiera "ver" o "editar" una encuesta
    // Podrías usar router.navigate para ir a la ruta de edición/visualización
    verEncuesta(id: number): void {
      // Ejemplo: Navegar a una ruta de detalle/edición
      // this.router.navigate(['/empleados/encuestas/editar', id]);
      alert('Funcionalidad de ver/editar encuesta para ID: ' + id);
    // Implementar la navegación real a tu componente de "crear-encuesta" o uno de edición
  }

  eliminarEncuesta(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta encuesta?')) {
      this.encuestasService.deleteEncuesta(id)
        .subscribe({
          next: () => {
            this.encuestas = this.encuestas.filter(e => e.idEncuesta !== id);
            alert('Encuesta eliminada con éxito.');
          },
          error: (err) => {
            console.error('Error al eliminar encuesta:', err);
            this.error = 'No se pudo eliminar la encuesta.';
          }
        });
    }
  }
}
