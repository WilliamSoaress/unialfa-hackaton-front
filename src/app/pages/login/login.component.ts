import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/usuario/auth-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errorMessage: string;

  usuarioModel = {
    login: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required]),
    });
  }

  login() {
    if (this.form.invalid) {
      return;
    }

    const loginData = {
      login: this.form.get('login').value,
      password: this.form.get('senha').value,
    };

    this.http
      .post<{ token: any }>(`${environment.API_URL}/login`, loginData)
      .subscribe(
        (response) => {
          const token = response.token;

          localStorage.setItem('authToken', token);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
