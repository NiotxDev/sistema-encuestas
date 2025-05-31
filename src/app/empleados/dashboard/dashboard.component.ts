import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  totalEncuestas = 10;
  respuestas = 7;
  get noResponden() {
    return this.totalEncuestas - this.respuestas;
  }
  constructor() {}
  
  ngOnInit(): void {}
}
