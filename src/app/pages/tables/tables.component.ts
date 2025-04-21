import {Component, OnInit} from '@angular/core';
import {SubCategory} from "../../../Models/SubCategory";
import {SubCategoryService} from "../../../Services/sub-category.service";
import {MatDialog} from "@angular/material/dialog";
import {SubCategoryComponent} from "../../components/sub-category/sub-category.component";
import {error} from "protractor";
import {Categorieng} from "../../../Models/Categorie";
import {CategorieService} from "../../../Services/categorie.service";

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  isLoading = false;

  dataSource1: SubCategory[] = [];
  displayedColumns: string[] = ['id', 'name', 'categorieId', 'actions'];
  categories: Categorieng[] = [];


  constructor(private SS: SubCategoryService, private dialog: MatDialog, private cs: CategorieService) {
  }


  ngOnInit() {
    this.loadCategoriesAndSubCategories();
  }

  loadCategoriesAndSubCategories() {
    this.cs.GetAllCat().subscribe(cats => {
      this.categories = cats;

      this.SS.GetAllSubCat().subscribe(subs => {
        this.dataSource1 = subs.map(sub => ({
          ...sub,
          categoryName: this.getCategoryName(sub.categorieId)
        }));
      });
    });
  }

  private getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Inconnue';
  }


  addSubC(): void {
    let dialogRef = this.dialog.open(SubCategoryComponent, {
      hasBackdrop: true,
      autoFocus: false,
      disableClose: false,
      panelClass: 'centered-modal',
    });
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.refreshSubCategories();
      }
    });

  }

  // refreshSubCategories():void{
  //   this.SS.GetAllSubCat().subscribe({
  //     next:(data)=>{
  //       this.dataSource1 = data;
  //       console.log('sub cat refresh',data);
  //     },
  //       error:(error)=>{
  //       console.error(error);
  //     }
  //   })
  // }
  refreshSubCategories(): void {
    // Réinitialise les catégories avant de recharger
    this.categories = [];
    this.dataSource1 = [];

    // Recharge les données complètes
    this.loadCategoriesAndSubCategories();
  }

  deleteSC(id: string): void {
    this.SS.deleteSC(id).subscribe(() => {
      this.refreshSubCategories();
    })

  }

}
