import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from 'src/Models/Annonce';
import { Article } from 'src/Models/Article';
import { Vendeur } from 'src/Models/Vendeur';


@Injectable({
  providedIn: 'root'
})
export class AnnonceService {
  private annoncesUrl = 'http://localhost:3002/annonces';
  private vendeursUrl = 'http://localhost:3002/vendeurs';
  private articlesUrl = 'http://localhost:3002/articles';

  constructor(private http: HttpClient) { }

  getAnnonces(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(this.annoncesUrl);
  }

  getVendeur(id: number): Observable<Vendeur> {
    return this.http.get<Vendeur>(`${this.vendeursUrl}/${id}`);
  }

  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.articlesUrl}/${id}`);
  }

  addAnnonce(annonce: Annonce): Observable<Annonce> {
    return this.http.post<Annonce>(this.annoncesUrl, annonce);
  }

  updateAnnonce(annonce: Annonce): Observable<Annonce> {
    return this.http.put<Annonce>(`${this.annoncesUrl}/${annonce.id}`, annonce);
  }

  deleteAnnonce(id: number): Observable<void> {
    return this.http.delete<void>(`${this.annoncesUrl}/${id}`);
  }

  addArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.articlesUrl, article);
  }
}
