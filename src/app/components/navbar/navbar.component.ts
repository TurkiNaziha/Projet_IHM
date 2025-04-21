import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
// import { CategorieService } from '../../Services/categorie.service';
import {Categorieng} from "../../../Models/Categorie";
import {CategorieService} from "../../../Services/categorie.service";
import {SubCategoryService} from "../../../Services/sub-category.service"; // Importer le service
// import { Categorieng } from '../../Models/Categorie'; // Importer l'interface

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public focus: boolean = false;
  public categories: Categorieng[] = []; // Liste des catégories
  public location: Location;
  @ViewChild('categoryList', { static: false }) categoryList!: ElementRef;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private categorieService: CategorieService ,
    private sc:SubCategoryService
  ) {
    this.location = location;
  }

  ngOnInit() {
    // Charger les catégories
    this.loadCategories();
  }

  loadCategories(): void {
    this.categorieService.GetAllCat().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Catégories chargées dans la navbar:', this.categories);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories:', err);
        this.categories = [];
      }
    });
  }

  // Méthode pour naviguer vers une catégorie (facultatif)
  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/category', categoryId]); // Ajustez selon votre routage
  }
  scrollCategories(direction: 'left' | 'right'): void {
    const element = this.categoryList.nativeElement;
    const scrollAmount = 200; // Ajustez cette valeur selon vos besoins
    if (direction === 'left') {
      element.scrollLeft -= scrollAmount;
    } else {
      element.scrollLeft += scrollAmount;
    }
  }


}
