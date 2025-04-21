import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Annonce } from 'src/Models/Annonce';
import { Article } from 'src/Models/Article';
import { Vendeur } from 'src/Models/Vendeur';

@Component({
  selector: 'app-view-annonce-dialog',
  template: `
    <h2 mat-dialog-title>Détails de l'Annonce</h2>
    <mat-dialog-content>
      <p><strong>ID:</strong> {{ data.annonce.id }}</p>
      <p><strong>Article:</strong> {{ data.article.nom }}</p>
      <p><strong>Vendeur:</strong> {{ data.vendeur.prenom }} {{ data.vendeur.nom }}</p>
      <p><strong>Durée:</strong> {{ data.annonce.duree }} jours</p>
      <p><strong>Statut:</strong> {{ data.annonce.statut }}</p>
      <p><strong>Date Début:</strong> {{ data.annonce.dateDebut | date }}</p>
      <p><strong>Date Fin:</strong> {{ data.annonce.dateFin | date }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="dialogRef.close()">Fermer</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      color: #5e72e4;
      font-weight: 600;
    }
    p {
      margin: 8px 0;
      font-size: 14px;
    }
    p strong {
      color: #32325d;
    }
  `],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule]
})
export class ViewAnnonceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewAnnonceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { annonce: Annonce; article: Article; vendeur: Vendeur }
  ) {}
}
