import { Professor } from 'src/app/shared/models/professor';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Aluno } from '../../models/aluno';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private readonly endpoint: string = '/professor';

  constructor(private http: HttpClient) {}

  private create(record: Partial<Professor>) {
    return this.http.post<Professor>(
      `${environment.API_URL}${this.endpoint + '/novo'}`,
      record
    );
  }

  public update(record: Partial<Professor>) {
    return this.http
      .put<Professor>(
        `${environment.API_URL}${this.endpoint}/${record.id}`,
        record
      )
      .pipe(first());
  }

  save(record: Partial<Professor>) {
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

  public findById(id: number): Observable<Professor> {
    return this.http.get<Professor>(
      `${environment.API_URL}${this.endpoint}/${id}`
    );
  }

  findByNameProfessor(nome: string): Observable<Professor[]> {
    return this.http
      .get<Professor[]>(`${environment.API_URL}${this.endpoint}` + '/search', {
        params: { q: nome },
      })
      .pipe(
        map((professores) =>
          professores.filter((professor) =>
            professor.nome.toLowerCase().includes(nome.toLowerCase())
          )
        )
      );
  }
}
