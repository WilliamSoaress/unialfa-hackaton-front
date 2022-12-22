import jwtDecode from 'jwt-decode';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private logoutSubject = new Subject<void>();
  logout$ = this.logoutSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(login: string, senha: string) {
    const body = { login, senha };
    return this.http.post<any>(`${environment.API_URL}/login`, body).pipe(
      map((response) => {
        if (!response.token) {
          throw new Error(
            'Token de autenticação não encontrado na resposta da chamada HTTP'
          );
        }
        localStorage.setItem('token', response.token);
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('usuario_logado');
    this.logoutSubject.next();
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    if (token === null) {
      return false;
    }
    return token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    return !expirationDate || expirationDate.valueOf() < new Date().valueOf();
  }

  private getTokenExpirationDate(token: string): Date {
    const decodedToken = this.decodeToken(token);

    if (!decodedToken.exp) {
      return null;
    }
    return new Date(decodedToken.exp * 1000);
  }

  private decodeToken(token: string): any {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    return jwtDecode(token);
  }

  buscarPerfil(login: string): Observable<string> {
    return this.http.get<string>(`${environment.API_URL}/api/usuario/${login}`);
  }

  authenticate(login: string, senha: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    const body = `login=${login}&senha=${senha}`;
    return this.http.post<any>(`${environment.API_URL}/login`, body, {
      headers,
    });
  }
}
