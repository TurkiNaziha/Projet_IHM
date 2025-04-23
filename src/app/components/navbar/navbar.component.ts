// // src/app/components/navbar/navbar.component.ts
// import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
// import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
// import { Router } from '@angular/router';
// import { CategorieService } from '../../../Services/categorie.service';
// import { Categorieng } from '../../../Models/Categorie';
// import { SubCategory } from '../../../Models/SubCategory';
//
// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.scss']
// })
// export class NavbarComponent implements OnInit {
//   public focus: boolean = false;
//   public categories: Categorieng[] = [];
//   public subCategories: SubCategory[] = [];
//   public location: Location;
//   currentCategoryId: string | null = null;
//
//   @ViewChild('categoryList', { static: false }) categoryList!: ElementRef;
//
//   constructor(
//     location: Location,
//     private element: ElementRef,
//     private router: Router,
//     private categorieService: CategorieService
//   ) {
//     this.location = location;
//   }
//
//   ngOnInit() {
//     this.loadCategories();
//   }
//
//   loadCategories(): void {
//     this.categorieService.GetAllCat().subscribe({
//       next: (categories) => {
//         this.categories = categories;
//         console.log('Catégories chargées dans la navbar:', this.categories);
//       },
//       error: (err) => {
//         console.error('Erreur lors du chargement des catégories:', err);
//         this.categories = [];
//       }
//     });
//   }
//
//   onCategoryHover(categoryId: string): void {
//     if (this.currentCategoryId !== categoryId) {
//       this.currentCategoryId = categoryId;
//       this.categorieService.getSubCategoriesByCategoryId(categoryId).subscribe({
//         next: (subCategories) => {
//           this.subCategories = subCategories || [];
//           console.log(`Sous-catégories chargées pour categorieId=${categoryId}:`, this.subCategories);
//         },
//         error: (err) => {
//           console.error(`Erreur lors du chargement des sous-catégories pour categorieId=${categoryId}:`, err);
//           this.subCategories = [];
//         }
//       });
//     }
//   }
//
//   onCategoryLeave(): void {
//     this.currentCategoryId = null;
//     this.subCategories = [];
//   }
//
//   navigateToCategory(categoryId: string, subCategory?: string): void {
//     const route = subCategory ? `/category/${categoryId}/${subCategory.toLowerCase()}` : `/category/${categoryId}`;
//     this.router.navigate([route]);
//   }
//
//   scrollCategories(direction: 'left' | 'right'): void {
//     const element = this.categoryList.nativeElement;
//     const scrollAmount = 200;
//     if (direction === 'left') {
//       element.scrollLeft -= scrollAmount;
//     } else {
//       element.scrollLeft += scrollAmount;
//     }
//   }
// }


import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
// import { CategorieService } from '../../Services/categorie.service';
import {Categorieng} from "../../../Models/Categorie";
import {CategorieService} from "../../../Services/categorie.service";
import {SubCategoryService} from "../../../Services/sub-category.service";
import {Observable} from "rxjs";
import {SubCategory} from "../../../Models/SubCategory"; // Importer le service
// import { Categorieng } from '../../Models/Categorie'; // Importer l'interface

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public focus: boolean = false;
  public categories: Categorieng[] = []; // Liste des catégories
  public subCategories: SubCategory[];
  public location: Location;
  currentCategoryId: string | null = null;
  isDropdownOpen: boolean = false;
  isLogin : boolean = false;
  isAccount : boolean = false;
  isDashboard: boolean = false;
  @ViewChild('categoryList', { static: false }) categoryList!: ElementRef;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private categorieService: CategorieService ,
    private sc:SubCategoryService

  ) {
    this.location = location;
    this.router.events.subscribe(() => {
      this.isLogin = this.router.url.includes('login')
      console.log(this.isLogin);
    })
    this.router.events.subscribe(() => {
      this.isDashboard = this.router.url.includes('dashboard');
    })
  }

  ngOnInit() {
    // Charger les catégories
    this.loadCategories();
  }
  // logout(): void {
  //   localStorage.removeItem('token');
  //   this.clearFavorites();
  //   this.router.navigate(['/home']);
  //
  // }

  clearFavorites() {
    // this.favorites = [];
    sessionStorage.removeItem('favorites');
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

  onCategoryHover(categoryId: string): void {
    if (this.currentCategoryId !== categoryId) {
      this.currentCategoryId = categoryId;
      this.categorieService.getSubCategoriesByCategoryId(categoryId).subscribe(subCategories => {
        this.subCategories = subCategories;
      });
    }
  }
  onCategoryLeave(): void {
    this.currentCategoryId = null;
    this.subCategories = [];
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen; // Toggle dropdown visibility
  }
  compteDropdown(): void {
    this.isAccount = !this.isAccount;

  }
  navigateToLogin(): void {
    this.isAccount = false; // Close dropdown after navigation
    this.router.navigate(['/login']); // Adjust route as needed
  }
 navigateToRegister(): void {
    this.isAccount = false; // Close dropdown after navigation
    this.router.navigate(['/register']); // Adjust route as needed
  }

  navigateToCreateCategory(): void {
    this.isDropdownOpen = false; // Close dropdown after navigation
    this.router.navigate(['/maps']); // Adjust route as needed
  }

  navigateToCreateSubCategory(): void {
    this.isDropdownOpen = false; // Close dropdown after navigation
    this.router.navigate(['/tables']); // Adjust route as needed
  }



}
