import { Component } from '@angular/core';
import { AuthService } from './shared/services/usuario/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'academia-app';


  authService: AuthService;
  constructor(authService: AuthService){
    this.authService = authService;
  }


}
