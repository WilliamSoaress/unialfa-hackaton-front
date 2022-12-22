import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/usuario/auth-service.service';

@Component({
  selector: 'app-pages.home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.redirect();
  }

  redirect() {
    let estaLogado = this.authService.isLoggedIn();
    if (!estaLogado) {
      return this.router.navigateByUrl('/login');
    }
    return null;
  }
}
