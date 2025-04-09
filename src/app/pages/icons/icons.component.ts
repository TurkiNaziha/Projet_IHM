import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {
  public copy: string;
  annonces: any[] = [];
  categories: any[] = [];
  sousCategories: any[] = [];
  filteredSousCategories: any[] = [];
  newAnnonce: any = {
    article: {
      nom: '',
      description: '',
      prixInitial: 0,
      categorie: null,
      sousCategorie: null,
      marque: '',
      etat: '',
      image: null
    },
    enchere: {
      prixActuel: 0
    },
    duree: 0,
    statut: '',
    dateDebut: new Date(),
    dateFin: new Date()
  };

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    // Données mockées pour les catégories
    this.categories = [
      { id: 1, name: 'Électronique' },
      { id: 2, name: 'Vêtements' },
      { id: 3, name: 'Meubles' }
    ];

    // Données mockées pour les sous-catégories
    this.sousCategories = [
      { id: 1, name: 'Smartphones', categorieId: 1 },
      { id: 2, name: 'Ordinateurs', categorieId: 1 },
      { id: 3, name: 'T-Shirts', categorieId: 2 },
      { id: 4, name: 'Chaises', categorieId: 3 }
    ];

    // Annonces pré-remplies avec des images réelles
    this.annonces = [
      {
        id: 1,
        article: {
          nom: 'iPhone 13',
          description: 'Smartphone dernière génération',
          prixInitial: 800,
          categorie: this.categories[0],
          sousCategorie: this.sousCategories[0],
          marque: 'Apple',
          etat: 'Neuf',
          image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pink-select-2021?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1629842712000' // Image réelle de l'iPhone 13
        },
        enchere: { prixActuel: 850 },
        duree: 7,
        statut: 'En cours',
        dateDebut: new Date('2025-04-01'),
        dateFin: new Date('2025-04-08')
      },
      {
        id: 2,
        article: {
          nom: 'Chaise Design',
          description: 'Chaise ergonomique moderne',
          prixInitial: 150,
          categorie: this.categories[2],
          sousCategorie: this.sousCategories[3],
          marque: 'Ikea',
          etat: 'Bon',
          image: 'https://www.ikea.com/us/en/images/products/stefan-chair-brown-black__0727320_pe735593_s5.jpg?f=s' // Image réelle d'une chaise IKEA
        },
        enchere: { prixActuel: 165 },
        duree: 5,
        statut: 'En cours',
        dateDebut: new Date('2025-04-03'),
        dateFin: new Date('2025-04-08')
      }
    ];
  }

  // Ouvre le modal
  openModal(content: any) {
    this.modalService.open(content, { 
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'lg'
    });
  }

  // Gère le changement de catégorie pour filtrer les sous-catégories
  onCategorieChange() {
    const selectedCategorie = this.newAnnonce.article.categorie;
    if (selectedCategorie) {
      this.filteredSousCategories = this.sousCategories.filter(
        (sousCategorie) => sousCategorie.categorieId === selectedCategorie.id
      );
      this.newAnnonce.article.sousCategorie = null;
    } else {
      this.filteredSousCategories = [];
    }
  }

  // Gère l'upload de l'image
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newAnnonce.article.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Ajoute une nouvelle annonce
  addAnnonce(modal: any) {
    const dateDebut = new Date();
    const dateFin = new Date(dateDebut);
    dateFin.setDate(dateDebut.getDate() + this.newAnnonce.duree);

    const annonce = {
      id: this.annonces.length + 1,
      article: { ...this.newAnnonce.article },
      enchere: { prixActuel: this.newAnnonce.article.prixInitial },
      duree: this.newAnnonce.duree,
      statut: this.newAnnonce.statut,
      dateDebut: dateDebut,
      dateFin: dateFin
    };

    this.annonces.push(annonce);

    this.newAnnonce = {
      article: {
        nom: '',
        description: '',
        prixInitial: 0,
        categorie: null,
        sousCategorie: null,
        marque: '',
        etat: '',
        image: null
      },
      enchere: {
        prixActuel: 0
      },
      duree: 0,
      statut: '',
      dateDebut: new Date(),
      dateFin: new Date()
    };

    modal.close();
  }

  // Supprime une annonce
  deleteAnnonce(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
      this.annonces = this.annonces.filter(annonce => annonce.id !== id);
    }
  }

  // Voir les détails d'une annonce
  viewAnnonce(annonce: any) {
    alert(`Détails de l'annonce:\nNom: ${annonce.article.nom}\nPrix: ${annonce.enchere.prixActuel}€\nStatut: ${annonce.statut}`);
  }

  // Modifier une annonce
  editAnnonce(annonce: any, content: any) {
    this.newAnnonce = JSON.parse(JSON.stringify(annonce));
    const modalRef = this.modalService.open(content, { 
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'lg'
    });
    
    modalRef.result.then(() => {
      const index = this.annonces.findIndex(a => a.id === annonce.id);
      if (index !== -1) {
        this.annonces[index] = { ...this.newAnnonce };
      }
    });
  }
}