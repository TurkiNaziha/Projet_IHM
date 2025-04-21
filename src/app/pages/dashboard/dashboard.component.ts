import { Component, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  currentSlide = 0;
  slides = [0, 1, 2]; // Represents the 3 slides
  private autoSlideInterval: any; // Pour stocker l'intervalle et le nettoyer

  // Liste des articles mise à jour avec des téléphones et des sacs
  items = [
    {
      title: 'iPhone 14 Pro Max',
      description: 'Brand new, 256GB, Space Black',
      price: '$999.00',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg' // Image d'un iPhone
    },
    {
      title: 'Samsung Galaxy S23 Ultra',
      description: '512GB, Phantom Black, Unlocked',
      price: '$1199.00',
      image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg' // Image d'un Samsung Galaxy
    },
    {
      title: 'Google Pixel 8 Pro',
      description: '128GB, Obsidian, Brand New',
      price: '$899.00',
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg' // Image d'un Google Pixel
    },
    {
      title: 'Leather Crossbody Bag',
      description: 'Genuine Leather, Black',
      price: '$59.99',
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg' // Image d'un sac en cuir
    },
    {
      title: 'Designer Tote Bag',
      description: 'Canvas Tote, Beige, Spacious Interior',
      price: '$79.99',
      image: 'https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg' // Image d'un sac tote
    },
    {
      title: 'Backpack for Travel',
      description: 'Waterproof, Grey, Multiple Compartments',
      price: '$49.99',
      image: 'https://images.pexels.com/photos/290523/pexels-photo-290523.jpeg' // Image d'un sac à dos
    }
  ];

  ngOnInit() {
    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

    var chartOrders = document.getElementById('chart-orders');
    parseOptions(Chart, chartOptions());

    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = document.getElementById('chart-sales');
    this.salesChart = new Chart(chartSales, {
      type: 'line',
      options: chartExample1.options,
      data: chartExample1.data
    });

    // Démarrer le défilement automatique du carousel
    this.startAutoSlide();
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change de slide toutes les 5 secondes (5000ms)
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  // Méthode pour gérer le défilement des articles
  scrollItems(direction: string): void {
    const itemsList = document.querySelector('.items-list') as HTMLElement;
    const scrollAmount = 300; // Ajustez cette valeur selon vos besoins
    if (direction === 'left') {
      itemsList.scrollLeft -= scrollAmount;
    } else {
      itemsList.scrollLeft += scrollAmount;
    }
  }

  ngOnDestroy(): void {
    // Nettoyer l'intervalle lorsque le composant est détruit pour éviter les fuites de mémoire
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }
}








// ouma
// // import { Component, OnInit } from '@angular/core';
// // import Chart from 'chart.js';
//
// // core components
// import {
//   chartOptions,
//   parseOptions,
//   chartExample1,
//   chartExample2
// } from "../../variables/charts";
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import Chart from 'chart.js';
//
// // core components
//
// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss']
// })
// export class DashboardComponent implements OnInit, OnDestroy  {
//
//   public datasets: any;
//   public data: any;
//   public salesChart;
//   public clicked: boolean = true;
//   public clicked1: boolean = false;
//
//   ngOnInit() {
//
//     this.datasets = [
//       [0, 20, 10, 30, 15, 40, 20, 60, 60],
//       [0, 20, 5, 25, 10, 30, 15, 40, 40]
//     ];
//     this.data = this.datasets[0];
//
//
//     var chartOrders = document.getElementById('chart-orders');
//
//     parseOptions(Chart, chartOptions());
//
//
//     var ordersChart = new Chart(chartOrders, {
//       type: 'bar',
//       options: chartExample2.options,
//       data: chartExample2.data
//     });
//
//     var chartSales = document.getElementById('chart-sales');
//
//     this.salesChart = new Chart(chartSales, {
// 			type: 'line',
// 			options: chartExample1.options,
// 			data: chartExample1.data
// 		});
//   }
//
//
//   public updateOptions() {
//     this.salesChart.data.datasets[0].data = this.data;
//     this.salesChart.update();
//   }
//
// }
