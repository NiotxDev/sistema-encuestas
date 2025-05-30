import { Component, input } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-subir-clientes',
  standalone: false,
  templateUrl: './subir-clientes.component.html',
  styleUrl: './subir-clientes.component.scss'
})
export class SubirClientesComponent {
  correos: string[] = [];

  onFileChange(event: Event): void{
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      alert('No se seleccionó ningún archivo.');
      return;
    }
    
  const archivo = input.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {

    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, {type: 'array'});

    const hoja = workbook.SheetNames[0];
    const hojaDatos = workbook.Sheets[hoja];
    const datos: any[][] = XLSX.utils.sheet_to_json(hojaDatos,{header:1});

    this.correos = datos.map((fila) => fila[0]).filter((valor) => typeof valor === 'string' && this.validarEmail(valor));
  };
  reader.readAsArrayBuffer(archivo);
}
  validarEmail(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }
}
