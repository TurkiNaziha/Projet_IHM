import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AnnonceService } from 'src/Services/annonces.service';
import { Annonce } from 'src/Models/Annonce';
import { Vendeur } from 'src/Models/Vendeur';
import { Article } from 'src/Models/Article';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalAnnonceComponent } from 'src/app/components/modal-annonce/modal-annonce.component';
import { catchError, forkJoin, of } from 'rxjs';
import { ViewAnnonceDialogComponent } from '../view/view-annonce-dialog';
import { DeleteConfirmationDialogComponent } from '../delete/delete-confirmation-dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-annonce-list',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
})
export class AnnonceListComponent implements OnInit {
  annonces: Annonce[] = [];
  vendeurs: { [key: number]: Vendeur } = {};
  articles: { [key: number]: Article } = {};
  dataSource = new MatTableDataSource<Annonce>();
  filteredDataSource = new MatTableDataSource<Annonce>();
  displayedColumns: string[] = ['id', 'image', 'article', 'vendeur', 'duree', 'statut', 'dateDebut', 'dateFin', 'actions'];
  isLoading: boolean = true;
  sortOrder: string = 'newest';
  statusFilter: string = '';

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
                this.articles[annonce.articleId] = { 
                  id: annonce.articleId, 
                  nom: 'Inconnu', 
                  description: '', 
                  categorieId: '', 
                  prixInitial: 0, 
                  vendeurId: 0, 
                  sousCategorieId: '', 
                  marque: '', 
                  etat: '',
                  // image: ''
                };
              }
            });

            this.applyFilters();
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

  applyFilters(): void {
    let filteredData = [...this.annonces];

    // Apply status filter
    if (this.statusFilter) {
      filteredData = filteredData.filter(annonce => annonce.statut === this.statusFilter);
    }

    // Apply sort order
    filteredData.sort((a, b) => {
      const dateA = new Date(a.dateDebut).getTime();
      const dateB = new Date(b.dateDebut).getTime();
      return this.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    this.filteredDataSource.data = filteredData;
    this.cdr.detectChanges();
  }

  setStatusFilter(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
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

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1694034206248-12153fd67e27?w=800&auto=format&fit=crop&q=60';
  }
}