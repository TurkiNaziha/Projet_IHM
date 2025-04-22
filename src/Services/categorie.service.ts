import { Injectable } from '@angular/core';
import {Categorieng} from "../Models/Categorie";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {SubCategory} from "../Models/SubCategory";

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private http: HttpClient) { }
  GetAllCat(): Observable<Categorieng[]> {
    return this.http.get<Categorieng[]>('http://localhost:3002/categories')
  }
  AddCat(category: Categorieng): Observable<void> {
    return this.http.post<void>('http://localhost:3002/categories', category)

  }
  onDelete(id: String): Observable<void> {
    return this.http.delete<void>(`http://localhost:3002/categories/${id}`)
  }
  getSubCategoriesByCategoryId(categoryId: string): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(
      `http://localhost:3002/sousCategories?categorieId=${categoryId}`
    );
  }


}
