import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  login() {
    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:3000/api/user/login', payload)
      .subscribe({
        next: (response) => {
          console.log('Login success:', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('userId', response.userId);

          this.router.navigate(['/dashboard']); // Replace with your actual route
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Login failed';
        }
      });
  }
}
