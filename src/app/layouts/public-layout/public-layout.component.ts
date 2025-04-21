// src/app/layouts/public-layout/public-layout.component.ts
import { Component } from '@angular/core';
import { ComponentsModule } from "../../components/components.module";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    RouterOutlet
  ],
  styleUrls: [ './public-layout.component.scss' ]
})
export class PublicLayoutComponent { }
