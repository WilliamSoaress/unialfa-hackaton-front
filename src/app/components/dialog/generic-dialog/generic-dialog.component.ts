import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-generic-dialog',
  template: `
  <h1 mat-dialog-title>{{ titulo }}</h1>
  <div mat-dialog-content>
    {{ mensagem }}
  </div>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close>OK</button>
  </div>

  `,
  styleUrls: ['./generic-dialog.component.css'],
})
export class GenericDialogComponent {
  titulo!: string;
  mensagem!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.titulo = data.titulo;
    this.mensagem = data.mensagem;
  }
}
