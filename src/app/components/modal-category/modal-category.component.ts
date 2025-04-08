// import { Component } from '@angular/core';
// import {MatDialogRef} from "@angular/material/dialog";
// import {CategorieService} from "../../../Services/categorie.service";
// import {FormGroup} from "@angular/forms";
// import {Router} from "@angular/router";
// @Component({
//   selector: "modal-category",
//   templateUrl: "./modal-category.component.html",
//   standalone: true,
//   styleUrls: ["./modal-category.component.scss"]
// })
// export class ModalCategoryComponent{
//   constructor(public cs: CategorieService ,private router: Router,public dialogRef: MatDialogRef<Component>){}
//   form !: FormGroup;
//
//
//   onClick() : void{
// this.dialogRef.close();
// }
//   onSubmit() : void{
//     this.cs.AddCat(this.form.value).subscribe(() => {
//
//
//     });
//
//   }
// }
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {CategorieService} from "../../../Services/categorie.service";
import {Categorieng} from "../../../Models/Categorie";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: "modal-category",
  templateUrl: "./modal-category.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ["./modal-category.component.scss"]
})
export class ModalCategoryComponent implements OnInit {
  form: FormGroup;

  // currentId: string | null = null;

  constructor(
    private cs: CategorieService,
    private router: Router,
    public dialogRef: MatDialogRef<ModalCategoryComponent>,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required])
    });

    // Si vous avez besoin de gérer l'édition comme dans l'exemple
    /* this.currentId = this.activatedRoute.snapshot.params['id'];
    if (this.currentId) {
      this.cs.getCategoryById(this.currentId).subscribe((cat) => {
        this.form.patchValue({
          id: cat.id,
          name: cat.name
        });
      });
    } */
  }

  // onSubmit(): void {
  //   if (this.form.valid) {
  //
  //     this.cs.AddCat(this.form.value).subscribe(() => {
  //       this.dialogRef.close(true);
  //
  //       this.router.navigate(["/maps"]);
  //     })
  //     // }
  //   }
  // }
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cs.AddCat(this.form.value).subscribe({
      next: () => {
        this.dialogRef.close(true); // Ferme la modal et indique le succès
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout:", err);
      }
    });
  }

  private handleSuccess(): void {
    this.dialogRef.close(true); // Ferme la modal avec un retour positif
    this.router.navigate(['/maps']); // Redirige si nécessaire
  }

  onCancel(): void {
    this.dialogRef.close(false); // Ferme la modal sans action
  }
}
