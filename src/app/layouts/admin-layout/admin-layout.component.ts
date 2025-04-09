import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from "../../components/components.module";

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  // Removed 'imports' as it is only valid for standalone components
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
