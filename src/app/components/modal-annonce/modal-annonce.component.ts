import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnnonceService } from 'src/Services/annonces.service';
import { CategorieService } from 'src/Services/categorie.service';
import { SubCategoryService } from 'src/Services/sub-category.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { SubCategory } from 'src/Models/SubCategory';
import { Categorieng } from 'src/Models/Categorie';
import { Annonce } from 'src/Models/Annonce';
import { Article } from 'src/Models/Article';


@Component({
  selector: 'app-modal-annonce',

  templateUrl: './modal-annonce.component.html',
  styleUrls: ['./modal-annonce.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule
  ]
})
export class ModalAnnonceComponent implements OnInit {

  
  annonceForm: FormGroup;
  articleForm: FormGroup;
  categories: Categorieng[] = [];
  sousCategories: SubCategory[] = [];
  filteredSousCategories: SubCategory[] = [];
  isLoading: boolean = true;
  isEditMode: boolean = false;
  defaultVendeurId: number = 101; // Default vendeurId (e.g., Jean Dupont)

  constructor(
    private annonceService: AnnonceService,
    private categorieService: CategorieService,
    private sousCategorieService: SubCategoryService,
    public dialogRef: MatDialogRef<ModalAnnonceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { annonce?: Annonce, article?: Article }
  ) {
    this.annonceForm = new FormGroup({
      duree: new FormControl(null, [Validators.required, Validators.min(1)]),
      statut: new FormControl(null, [Validators.required]),
      dateDebut: new FormControl(null, [Validators.required]),
      dateFin: new FormControl(null, [Validators.required])
    });

    this.articleForm = new FormGroup({
      nom: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      categorieId: new FormControl(null, [Validators.required]),
      sousCategorieId: new FormControl(null, [Validators.required]),
      prixInitial: new FormControl(null, [Validators.required, Validators.min(0)]),
      marque: new FormControl(null, [Validators.required]),
      etat: new FormControl(null, [Validators.required])
    });

    if (data?.annonce && data?.article) {
      this.isEditMode = true;
      this.annonceForm.patchValue({
        duree: data.annonce.duree,
        statut: data.annonce.statut,
        dateDebut: new Date(data.annonce.dateDebut).toISOString().split('T')[0],
        dateFin: new Date(data.annonce.dateFin).toISOString().split('T')[0]
      });
      this.articleForm.patchValue({
        nom: data.article.nom,
        description: data.article.description,
        categorieId: data.article.categorieId,
        sousCategorieId: data.article.sousCategorieId,
        prixInitial: data.article.prixInitial,
        marque: data.article.marque,
        etat: data.article.etat
      });
      this.defaultVendeurId = data.annonce.vendeurId;
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSousCategories();
    this.articleForm.get('categorieId')?.valueChanges.subscribe(categorieId => {
      this.filterSousCategories(categorieId);
    });
  }

  previewUrl: string | ArrayBuffer | null = null;

onImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => this.previewUrl = reader.result;
    reader.readAsDataURL(file);
  }
}





  loadCategories(): void {
    this.isLoading = true;
    this.categorieService.GetAllCat()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (categories) => this.categories = categories,
        error: (err) => console.error('Erreur lors du chargement des catégories:', err)
      });
  }

  loadSousCategories(): void {
    this.sousCategorieService.GetAllSubCat()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (sousCategories) => {
          this.sousCategories = sousCategories;
          const categorieId = this.articleForm.get('categorieId')?.value;
          if (categorieId) {
            this.filterSousCategories(categorieId);
          }
        },
        error: (err) => console.error('Erreur lors du chargement des sous-catégories:', err)
      });
  }

  filterSousCategories(categorieId: string): void {
    this.filteredSousCategories = this.sousCategories.filter(sc => sc.categorieId === categorieId);
    if (!this.filteredSousCategories.some(sc => sc.id === this.articleForm.get('sousCategorieId')?.value)) {
      this.articleForm.get('sousCategorieId')?.setValue(null);
    }
  }

  onSubmit(): void {
    if (this.annonceForm.invalid || this.articleForm.invalid) {
      this.annonceForm.markAllAsTouched();
      this.articleForm.markAllAsTouched();
      return;
    }

    const articleData = {
      ...this.articleForm.value,
      id: this.isEditMode ? this.data.article!.id : 0,
      vendeurId: this.defaultVendeurId
    };

    const annonceData = {
      ...this.annonceForm.value,
      id: this.isEditMode ? this.data.annonce!.id : 0,
      articleId: this.isEditMode ? this.data.annonce!.articleId : 0,
      vendeurId: this.defaultVendeurId
    };

    if (this.isEditMode) {
      this.annonceService.updateAnnonce(annonceData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Erreur lors de la mise à jour de l\'annonce:', err)
      });
    } else {
      this.annonceService.addArticle(articleData).subscribe({
        next: (article) => {
          annonceData.articleId = article.id;
          this.annonceService.addAnnonce(annonceData).subscribe({
            next: () => this.dialogRef.close(true),
            error: (err) => console.error('Erreur lors de l\'ajout de l\'annonce:', err)
          });
        },
        error: (err) => console.error('Erreur lors de l\'ajout de l\'article:', err)
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
// import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatDialogRef } from '@angular/material/dialog';
// import { AnnonceService } from 'src/Services/annonces.service';
// import { CategorieService } from 'src/Services/categorie.service';
// import { SubCategoryService } from 'src/Services/sub-category.service';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { CommonModule } from '@angular/common';
// import { finalize } from 'rxjs';
// import { SubCategory } from 'src/Models/SubCategory';
// import { Categorieng } from 'src/Models/Categorie';

// @Component({
//   selector: 'app-modal-annonce',
//   templateUrl: './modal-annonce.component.html',
//   styleUrls: ['./modal-annonce.component.scss'],
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     CommonModule
//   ]
// })
// export class ModalAnnonceComponent implements OnInit {
//   annonceForm: FormGroup;
//   articleForm: FormGroup;
//   categories: Categorieng[] = [];
//   sousCategories: SubCategory[] = [];
//   isLoading: boolean = true;

//   constructor(
//     private annonceService: AnnonceService,
//     private categorieService: CategorieService,
//     private Ss: SubCategoryService,
//     public dialogRef: MatDialogRef<ModalAnnonceComponent>
//   ) {
//     this.annonceForm = new FormGroup({
//       duree: new FormControl(null, [Validators.required, Validators.min(1)]),
//       statut: new FormControl(null, [Validators.required]),
//       vendeurId: new FormControl(null, [Validators.required, Validators.min(1)]),
//       dateDebut: new FormControl(null, [Validators.required]),
//       dateFin: new FormControl(null, [Validators.required])
//     });

//     this.articleForm = new FormGroup({
//       nom: new FormControl(null, [Validators.required]),
//       description: new FormControl(null, [Validators.required]),
//       categorieId: new FormControl(null, [Validators.required]),
//       sousCategorieId: new FormControl(null, [Validators.required]),
//       prixInitial: new FormControl(null, [Validators.required, Validators.min(0)]),
//       marque: new FormControl(null, [Validators.required]),
//       etat: new FormControl(null, [Validators.required])
//     });
//   }

//   ngOnInit(): void {
//     this.loadCategories();
//     this.loadSousCategories();
//   }

//   loadCategories(): void {
//     this.isLoading = true;
//     this.categorieService.GetAllCat()
//       .pipe(finalize(() => this.isLoading = false))
//       .subscribe({
//         next: (categories) => this.categories = categories,
//         error: (err) => console.error('Erreur lors du chargement des catégories:', err)
//       });
//   }

//   loadSousCategories(): void {
//     this.Ss.GetAllSubCat()
//       .pipe(finalize(() => this.isLoading = false))
//       .subscribe({
//         next: (sousCategories) => this.sousCategories = sousCategories,
//         error: (err) => console.error('Erreur lors du chargement des sous-catégories:', err)
//       });
//   }

//   onSubmit(): void {
//     if (this.annonceForm.invalid || this.articleForm.invalid) {
//       this.annonceForm.markAllAsTouched();
//       this.articleForm.markAllAsTouched();
//       return;
//     }

//     const articleData = {
//       ...this.articleForm.value,
//       id: 0, // Will be assigned by JSON Server
//       vendeurId: this.annonceForm.value.vendeurId
//     };

//     this.annonceService.addArticle(articleData).subscribe({
//       next: (article) => {
//         const annonceData = {
//           ...this.annonceForm.value,
//           id: 0, // Will be assigned by JSON Server
//           articleId: article.id
//         };
//         this.annonceService.addAnnonce(annonceData).subscribe({
//           next: () => this.dialogRef.close(true),
//           error: (err) => console.error('Erreur lors de l\'ajout de l\'annonce:', err)
//         });
//       },
//       error: (err) => console.error('Erreur lors de l\'ajout de l\'article:', err)
//     });
//   }

//   onCancel(): void {
//     this.dialogRef.close(false);
//   }
// }