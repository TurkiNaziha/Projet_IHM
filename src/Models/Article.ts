export interface Article {
  id: number;
  nom: string;
  description: string;
  categorieId: string; // Updated to string to match db.json
  prixInitial: number;
  vendeurId: number;
  sousCategorieId: string; // Changed from sousCategorie to sousCategorieId
  marque: string;
  etat: string;
}
