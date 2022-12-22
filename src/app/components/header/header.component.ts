import { map } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AuthService } from 'src/app/shared/services/usuario/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() hidden: boolean;

  perfilUsuario: string;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.permissoes();
    this.hidden = this.authService.isLoggedIn();
    if (this.router.url == '/login') {
      this.hidden = true;
    }
  }


  verificaPerfilAluno(){
    if(this.perfilUsuario === 'ALUNO'){
      return false
    }
    return true
  }


  permissoes() {
    let tokenDecodificado = {
      sub: '',
      exp: '',
    };
    const token = localStorage.getItem('authToken');

    if (token != null) {
      tokenDecodificado = jwtDecode(token);
      this.authService.buscarPerfil(tokenDecodificado.sub).subscribe(
        (perfilUsuario: string) => {
          this.perfilUsuario = perfilUsuario;
          console.log(this.perfilUsuario);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  logout() {
    this.authService.logout();
  }

  public new(): void {
    this.router.navigateByUrl('/new');
  }

  public avaliacoes(): void {
    this.router.navigateByUrl('/avaliacoes');
  }

  public home(): void {
    this.router.navigateByUrl('/');
  }

  public grafico(): void {
    this.router.navigateByUrl('/grafico');
  }
}
