import { Injectable } from '@angular/core';
import {Categorieng} from "../Models/Categorie";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private http: HttpClient) { }
  GetAllCat(): Observable<Categorieng[]> {
    return this.http.get<Categorieng[]>('http://localhost:3001/categories')
  }
  AddCat(category: Categorieng): Observable<void> {
    return this.http.post<void>('http://localhost:3001/categories', category)

  }
  onDelete(id: String): Observable<void> {
    return this.http.delete<void>(`http://localhost:3001/categories/${id}`)
  }


}
