import { Component, OnInit } from '@angular/core';
import { EncuestasService } from '../../core/services/encuestas.service';
import { Encuesta } from '../../shared/models/encuestas.model'; // <-- Asegúrate de usar la interfaz correcta
import { AuthService, UserData } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-encuestas',
  standalone: false,
  templateUrl: './lista-encuestas.component.html',
  styleUrl: './lista-encuestas.component.scss'
})
export class ListaEncuestasComponent implements OnInit {
  encuestas: Encuesta[] = []; // Usa la interfaz si la tienes, si no, any[]
  loading: boolean = false; // Estado de carga para mostrar un spinner
  errorMessage: string | null = null; // Mensaje de error si la carga falla
  idEmpleado: number | null = null; // Para almacenar el ID del empleado logueado

  constructor(
    private encuestasService: EncuestasService,
    private authService: AuthService, // Inyecta el servicio de autenticación
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerIdEmpleadoYEncuestas();
  }

  /**
   * Obtiene el ID del empleado logueado desde el AuthService
   * y luego llama a cargarEncuestas.
   */
  obtenerIdEmpleadoYEncuestas(): void {
    const currentUser: UserData | null = this.authService.getCurrentUser();
  
    // --- DEBUGGING: Revisa estos logs en la consola del navegador ---
    console.log('DEBUG: CurrentUser obtenido del AuthService:', currentUser);

    if (currentUser && currentUser.id !== null && currentUser.id !== undefined) {
      // Como UserData.id está definido como 'number' en auth.service.ts
      // y esperamos que el backend lo devuelva como número, lo asignamos directamente.
      // Si tu backend lo devuelve como string, tendrías que usar:
      // this.idEmpleado = parseInt(currentUser.id.toString(), 10);
      this.idEmpleado = currentUser.id; 
      
      console.log('DEBUG: ID de empleado extraído y listo para usar:', this.idEmpleado);
      this.cargarEncuestas(this.idEmpleado);
    } else {
      this.errorMessage = 'No se pudo obtener el ID del empleado. Por favor, inicie sesión.';
      console.error('ERROR: ID de empleado no disponible. CurrentUser es nulo o ID es nulo/indefinido.');
      this.loading = false;
    }
  }


  /**
 * Carga la lista de encuestas desde el servicio para un empleado específico.
 * @param idEmpleado El ID del empleado cuyas encuestas se van a cargar.
 */
  cargarEncuestas(idEmpleado: number): void {
    this.loading = true;
    this.errorMessage = null; // Limpiar cualquier mensaje de error anterior
    console.log(`DEBUG: Cargando encuestas para el ID de empleado: ${idEmpleado}`);
    
    // Llamada al servicio para obtener encuestas por ID de empleado
    this.encuestasService.getEncuestasPorEmpleado(idEmpleado).subscribe({
      next: (data) => {
        this.encuestas = data;
        this.loading = false;
        console.log('DEBUG: Encuestas cargadas exitosamente:', data);
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las encuestas. Revisa la consola para más detalles.';
        console.error('ERROR: Error al cargar las encuestas:', error);
        this.loading = false;
      }
    });
  }
  crearNuevaEncuesta(): void {
    // Navega a la ruta para crear una nueva encuesta
    this.router.navigate(['/empleados/crear-encuesta']);
  }

  // Puedes añadir otros métodos aquí para manipular las encuestas, como editar o eliminar
  // Por ejemplo, un método para ir a la página de edición de una encuesta:
  editarEncuesta(idEncuesta: number): void {
    console.log(`Editar encuesta con ID: ${idEncuesta}`);
    // this.router.navigate(['/encuestas/editar', idEncuesta]); // Asumiendo una ruta de edición
  }

  eliminarEncuesta(idEncuesta: number): void {
    console.log(`Eliminar encuesta con ID: ${idEncuesta}`);
    // Aquí podrías llamar a un método en encuestaService para eliminar la encuesta
    // y luego recargar la lista o eliminarla del array local.
  }

}
