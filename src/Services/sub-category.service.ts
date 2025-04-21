import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SubCategory} from "../Models/SubCategory";
import {map, Observable} from "rxjs";
import {Categorieng} from "../Models/Categorie";

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private url = 'http://localhost:3002/sousCategories';
  // private subCategoriesUrl: string;

  constructor(private http: HttpClient) {
  }

  GetAllSubCat(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>('http://localhost:3002/sousCategories');

  }
  addSubC(Scategory: SubCategory): Observable<void> {
    return this.http.post<void>('http://localhost:3002/sousCategories', Scategory)

  }
  // addSubC(subCategory: SubCategory): Observable<SubCategory> {
  //   return this.http.post<SubCategory>(this.url, {
  //     id: subCategory.id,
  //     name: subCategory.name,
  //     categorieId: subCategory.categorieId,
  //     // L'API peut ignorer ce champ si elle ne le stocke pas
  //     category: subCategory.category
  //   });
  // }
  getSubCategoriesByCategoryId(categoryId: string): Observable<{ id: string; name: string; categorieId: string }[]> {
    // Utilise uniquement categorieId comme paramètre de filtrage
    return this.http.get<{ id: string; name: string; categorieId: string }[]>(
      `${this.url}/subcategories?categorieId=${categoryId}`
    );
  }
  deleteSC(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}
