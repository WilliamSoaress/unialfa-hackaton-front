import { Avaliacao } from './../../models/avaliacao';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { first, Observable } from 'rxjs';
import { Page } from '../../models/page';

@Injectable({
  providedIn: 'root',
})
export class AvaliacaoService {
  getAvaliacoes(alunoId: number): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(
      `${environment.API_URL}${this.endpoint}/aluno`
    );
  }

  private readonly endpoint: string = '/avaliacoes';

  constructor(private http: HttpClient) {}

  private create(record: Partial<Avaliacao>) {
    return this.http.post<Avaliacao>(
      `${environment.API_URL}${this.endpoint + '/novo'}`,
      record
    );
  }

  public update(record: Partial<Avaliacao>) {
    return this.http
      .put<Avaliacao>(
        `${environment.API_URL}${this.endpoint}/${record.id}`,
        record
      )
      .pipe(first());
  }

  save(record: Partial<Avaliacao>) {
    if (record.id) {
      return this.update(record);
    }
    return this.create(record);
  }

  remove(id: string) {
    return this.http
      .delete(`${environment.API_URL}${this.endpoint}/${id}`)
      .pipe(first());
  }

  public findById(id: number): Observable<Avaliacao> {
    return this.http.get<Avaliacao>(
      `${environment.API_URL}${this.endpoint}/${id}`
    );
  }

  getEvaluations(
    name: string,
    page: number,
    size: number
  ): Observable<Page<Avaliacao>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('nome', name);
    return this.http.get<Page<Avaliacao>>(
      `${environment.API_URL}${this.endpoint}`,
      {
        params,
      }
    );
  }

  getDiferencaImc(idAluno: number): Observable<number> {
    return this.http.get<number>(
      `${environment.API_URL}${this.endpoint}/diferenca-imc/${idAluno}`
    );
  }
}
