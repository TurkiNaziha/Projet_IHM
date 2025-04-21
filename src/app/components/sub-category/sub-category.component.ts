import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SubCategoryService} from "../../../Services/sub-category.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {CategorieService} from "../../../Services/categorie.service";
import {Categorieng} from "../../../Models/Categorie";
import {CommonModule, JsonPipe, NgIf} from "@angular/common";
import {error} from "protractor";
import {finalize} from "rxjs";

// import {SubCategoryService} from "../../../Services/sub-category.service";


@Component({
  selector: "app-sub-category",
  templateUrl: "./sub-category.component.html",
  styleUrls: ["./sub-category.component.scss"],
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgIf,
    JsonPipe,
    CommonModule
  ],

  standalone: true
})

export class SubCategoryComponent implements OnInit {
  form: FormGroup;
  categories: Categorieng[] = [];
  isLoading: boolean = true;

  constructor(private SS: SubCategoryService, private categorieService: CategorieService, private dialog: MatDialogRef<SubCategoryComponent>, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      categorieId: new FormControl(null, [Validators.required]),
      // category: new FormGroup({
      //   id: new FormControl(null, [Validators.required]),
      //   name: new FormControl(null, [Validators.required]),
      //   subCategories: new FormControl([])
      // })

    });
  }


  loadCategories(): void {
    this.isLoading = true;
    this.categorieService.GetAllCat()
      .pipe(
        // finalize s'exécute quand l'observable est complété ou en erreur
        finalize(() => {
          this.isLoading = false; // Désactive le spinner de chargement
        })
      )
      .subscribe({
        next: (categories) => {
          // Assignation des catégories reçues à la propriété du composant
          // Votre API retourne bien un tableau d'objets avec id et name
          this.categories = categories;
          console.log('Catégories chargées:', this.categories);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des catégories:', err);
        }
      });
  }
  //
  // Submit(): void {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }
  //   this.SS.addSubC(this.form.value).subscribe({
  //     next: () => {
  //       this.dialog.close(true);
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors de l\'ajout de la sous-catégorie:', err);
  //     }
  //   });


    Submit(): void {
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        return;
      }

      const formData = this.form.value;
      const selectedCategory = this.categories.find(c => c.id === formData.categorieId);

      // const subCategoryData = {
      //   ...formData,
      //   category: selectedCategory // On ajoute l'objet category complet
      // };
      const subCategoryData = {
        id: this.form.value.id,
        name: this.form.value.name,
        categorieId: this.form.value.categorieId // Correspond à l'interface
      };

      this.SS.addSubC(subCategoryData).subscribe({
        next: () => this.dialog.close(true),
        error: (err) => console.error('Erreur:', err)
      });
    }
    // Submit(): void {
    //   if (this.form.invalid) {
    //     this.form.markAllAsTouched();
    //     return;
    //   }
    //
    //   // Récupère les valeurs du formulaire
    //   const formData = this.form.value;
    //
    //   // Crée l'objet à envoyer avec la structure attendue par l'API
    //   const subCategoryToSend = {
    //     id: formData.id,
    //     name: formData.name,
    //     categorieId: formData.categorieId // Attention au nom du champ ici
    //   };

    //   this.SS.addSubC(subCategoryToSend).subscribe({
    //     next: () => {
    //       this.dialog.close(true);
    //     },
    //     error: (err) => {
    //       console.error('Erreur lors de l\'ajout:', err);
    //       // Ajoutez un message d'erreur utilisateur si nécessaire
    //     }
    //   });
    // }

  onCancel(): void {
    this.dialog.close(false);
  }

  // getCategory(): void {
  //   this.categorieService.GetAllCat().subscribe((data)=>{
  //     this.categories = data;
  //   })
  // }

}
