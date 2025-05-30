import { Component, input } from '@angular/core';

@Component({
  selector: 'app-subir-cupon',
  standalone: false,
  templateUrl: './subir-cupon.component.html',
  styleUrl: './subir-cupon.component.scss'
})
export class SubirCuponComponent {

  codigoCupon: string = '';
  archivoCupon: File | null = null;
  vistaPreviaUrl: string | null = null;

  onCodigoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.codigoCupon = input.value;
  }

  onArchivoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoCupon = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.vistaPreviaUrl = reader.result as string;
      }
      reader.readAsDataURL(this.archivoCupon);
    }
  }

  esImagen(): boolean {
    return !!this.archivoCupon?.type && this.archivoCupon.type.startsWith('image');
  }

  esPDF(): boolean {
    return this.archivoCupon?.type === 'application/pdf';
  }
  
  guardarCupon(): void {
    if (!this.codigoCupon) {
      alert('Debes ingresar un código de cupón.');
      return;
    }
    // Aquí podrías enviar `codigoCupon` y `archivoCupon` al backend
    console.log('Código:', this.codigoCupon);
    console.log('Archivo:', this.archivoCupon);
    alert('Cupón guardado correctamente ✅');
  }
}//Fin de Clase Principal
