import {Component, OnInit} from '@angular/core';
import {Categorieng} from "../../../Models/Categorie";
import {CategorieService} from "../../../Services/categorie.service";
import {MatDialog} from "@angular/material/dialog";
import {ModalCategoryComponent} from "../../components/modal-category/modal-category.component";
import {FormGroup} from "@angular/forms";
import {Overlay} from "ngx-toastr";

declare const google: any;
//
// @Component({
//   selector: 'app-maps',
//   templateUrl: './maps.component.html',
//   styleUrls: ['./maps.component.scss'],

// })
// @Component({
//   selector: 'table-dynamic-observable-data-example',
//   styleUrls: ['table-dynamic-observable-data-example.SCSS'],
//   templateUrl: 'table-dynamic-observable-data-example.html',
// })
@Component({
  selector: "maps",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.scss"]

})
export class MapsComponent implements OnInit {


  displayedColumns: string[] = ['id', 'name','actions'];
  dataSource: Categorieng [] = [];
  form !: FormGroup;


  constructor(private Cs: CategorieService, private dialogRef: MatDialog, private overlay: Overlay) {
  }

  ngOnInit() {
    this.Cs.GetAllCat().subscribe((data) => {
      this.dataSource = data;
      console.log('Data received:', data);
    })

  }


  addData(): void {
    let dialogRef = this.dialogRef.open(ModalCategoryComponent, {
      // width: '200px',
      // height: '0px',
      // position: {
      //   top: '0px',
      //   right: '0px'
      // },
      hasBackdrop: true,
      autoFocus: false,
      disableClose: false,
      panelClass: 'centered-modal', // Classe personnalisée
    });
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.refreshCategories(); // Rafraîchit les données
      }
    });
  }
  refreshCategories(): void {
    this.Cs.GetAllCat().subscribe({
      next: (data) => {
        this.dataSource = data;
        console.log('Données rafraîchies:', data);
      },
      error: (err) => {
        console.error('Erreur de rafraîchissement:', err);
      }
    });

  }
  delete(id: string): void {
    this.Cs.onDelete(id).subscribe(() => {
      this.refreshCategories();
    })

  }






}


// ngOnInit() {
//   let map = document.getElementById('map-canvas');
//   let lat = map.getAttribute('data-lat');
//   let lng = map.getAttribute('data-lng');
//
//   var myLatlng = new google.maps.LatLng(lat, lng);
//   var mapOptions = {
//       zoom: 12,
//       scrollwheel: false,
//       center: myLatlng,
//       mapTypeId: google.maps.MapTypeId.ROADMAP,
//       styles: [
//         {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},
//         {"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},
//         {"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},
//         {"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},
//         {"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},
//         {"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
//         {"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},
//         {"featureType":"water","elementType":"all","stylers":[{"color":'#5e72e4'},{"visibility":"on"}]}]
//   }
//
//   map = new google.maps.Map(map, mapOptions);
//
//   var marker = new google.maps.Marker({
//       position: myLatlng,
//       map: map,
//       animation: google.maps.Animation.DROP,
//       title: 'Hello World!'
//   });
//
//   var contentString = '<div class="info-window-content"><h2>Argon Dashboard</h2>' +
//       '<p>A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.</p></div>';
//
//   var infowindow = new google.maps.InfoWindow({
//       content: contentString
//   });
//
//   google.maps.event.addListener(marker, 'click', function() {
//       infowindow.open(map, marker);
//   });



