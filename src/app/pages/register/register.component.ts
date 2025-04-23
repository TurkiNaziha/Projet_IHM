import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  telephone: string = '';
  password: string = '';
  role: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  register(form: NgForm) {
    if (!form.valid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      return;
    }
  
    const payload = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      telephone: this.telephone,
      password: this.password,
      role: this.role
    };
  
    // Step 1: Check if email exists
    this.http.post<any>('http://localhost:3000/api/user/check-email', { email: this.email }).subscribe({
      next: () => {
        // Step 2: Check if phone exists
        this.http.post<any>('http://localhost:3000/api/user/check-phone', { telephone: this.telephone }).subscribe({
          next: () => {
            // Step 3: Register the user
            this.http.post<any>('http://localhost:3000/api/user/register', payload).subscribe({
              next: (response) => {
                console.log('Registration successful:', response);
                // Reset form fields
                this.nom = '';
                this.prenom = '';
                this.email = '';
                this.telephone = '';
                this.password = '';
                this.role = '';
                this.errorMessage = '';
                this.router.navigate(['/dashboard']);
              },
              error: (err) => {
                console.error('Registration error:', err);
                this.errorMessage = err.error.message || 'Échec de l\'enregistrement.';
              }
            });
          },
          error: (err) => {
            console.error('Phone check error:', err);
            this.errorMessage = err.error.message || 'Le numéro de téléphone est déjà utilisé.';
          }
        });
      },
      error: (err) => {
        console.error('Email check error:', err);
        this.errorMessage = err.error.message || 'L\'adresse email est déjà utilisée.';
      }
    });
  }
  
  
  
  



}
