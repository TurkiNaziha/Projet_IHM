import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {CategorieService} from "../Services/categorie.service";
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { MatTooltipModule } from '@angular/material/tooltip';



import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsComponent } from './pages/icons/icons.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    BrowserAnimationsModule,

    AppRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    AppRoutingModule

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,


  ],
  providers: [
    CategorieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
