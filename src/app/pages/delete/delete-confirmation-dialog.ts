import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Confirmer la Suppression</h2>
    <mat-dialog-content>
      Êtes-vous sûr de vouloir supprimer cette annonce ?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button color="warn" (click)="dialogRef.close(false)">Annuler</button>
      <button mat-raised-button color="primary" (click)="dialogRef.close(true)">Supprimer</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      color: #dc3545;
      font-weight: 600;
    }
    mat-dialog-content {
      font-size: 14px;
      color: #32325d;
    }
  `],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule]
})
export class DeleteConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>) {}
}
