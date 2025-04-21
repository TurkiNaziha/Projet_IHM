import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AnnonceService } from 'src/Services/annonces.service';
import { Annonce } from 'src/Models/Annonce';
import { Vendeur } from 'src/Models/Vendeur';
import { Article } from 'src/Models/Article';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalAnnonceComponent } from 'src/app/components/modal-annonce/modal-annonce.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, of } from 'rxjs';
import { ViewAnnonceDialogComponent } from '../view/view-annonce-dialog';
import { DeleteConfirmationDialogComponent } from '../delete/delete-confirmation-dialog';

@Component({
  selector: 'app-annonce-list',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],

  // imports: [
  //   MatButtonModule,
  //   MatTableModule,
  //   CommonModule
  // ]
})
export class AnnonceListComponent implements OnInit {
  annonces: Annonce[] = [];
  vendeurs: { [key: number]: Vendeur } = {};
  articles: { [key: number]: Article } = {};
  dataSource = new MatTableDataSource<Annonce>();
  displayedColumns: string[] = ['id', 'article', 'vendeur', 'duree', 'statut', 'dateDebut', 'dateFin', 'actions'];
  isLoading: boolean = true;

  constructor(
    private annonceService: AnnonceService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAnnonces();
  }

  loadAnnonces(): void {
    this.isLoading = true;
    this.annonceService.getAnnonces().subscribe({
      next: (annonces) => {
        this.annonces = annonces;
        this.dataSource.data = annonces;

        // Create arrays of observables for fetching vendeurs and articles
        const vendeurRequests = annonces.map(annonce =>
          this.annonceService.getVendeur(annonce.vendeurId).pipe(
            catchError(err => {
              console.error(`Erreur lors du chargement du vendeur ${annonce.vendeurId}:`, err);
              return of(null);
            })
          )
        );
        const articleRequests = annonces.map(annonce =>
          this.annonceService.getArticle(annonce.articleId).pipe(
            catchError(err => {
              console.error(`Erreur lors du chargement de l'article ${annonce.articleId}:`, err);
              return of(null);
            })
          )
        );

        // Use forkJoin to wait for all requests to complete
        forkJoin([...vendeurRequests, ...articleRequests]).subscribe({
          next: (responses) => {
            const vendeurResponses = responses.slice(0, annonces.length);
            const articleResponses = responses.slice(annonces.length);

            annonces.forEach((annonce, index) => {
              const vendeur = vendeurResponses[index];
              const article = articleResponses[index];
              if (vendeur) {
                this.vendeurs[annonce.vendeurId] = vendeur as Vendeur;
              } else {
                console.warn(`Vendeur ${annonce.vendeurId} non trouvé`);
                this.vendeurs[annonce.vendeurId] = { id: annonce.vendeurId, nom: 'Inconnu', prenom: '', email: '', password: '' };
              }
              if (article) {
                this.articles[annonce.articleId] = article as Article;
              } else {
                console.warn(`Article ${annonce.articleId} non trouvé`);
                this.articles[annonce.articleId] = { id: annonce.articleId, nom: 'Inconnu', description: '', categorieId: '', prixInitial: 0, vendeurId: 0, sousCategorieId: '', marque: '', etat: '' };
              }
            });

            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Erreur lors du chargement des données:', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des annonces:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddModal(): void {
    const dialogRef = this.dialog.open(ModalAnnonceComponent, {
      width: '500px',
      maxHeight: '80vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAnnonces();
      }
    });
  }

  viewAnnonce(annonce: Annonce): void {
    const article = this.articles[annonce.articleId];
    const vendeur = this.vendeurs[annonce.vendeurId];
    this.dialog.open(ViewAnnonceDialogComponent, {
      width: '400px',
      data: { annonce, article, vendeur }
    });
  }

  editAnnonce(annonce: Annonce): void {
    const article = this.articles[annonce.articleId];
    const dialogRef = this.dialog.open(ModalAnnonceComponent, {
      width: '500px',
      maxHeight: '80vh',
      data: { annonce, article }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAnnonces();
      }
    });
  }

  deleteAnnonce(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.annonceService.deleteAnnonce(id).subscribe({
          next: () => this.loadAnnonces(),
          error: (err) => console.error('Erreur lors de la suppression:', err)
        });
      }
    });
  }
}
