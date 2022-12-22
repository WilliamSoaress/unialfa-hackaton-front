import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  first,
  map,
  Observable,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Aluno } from '../../models/aluno';

@Injectable({
  providedIn: 'root',
})
export class AlunoService {
  private readonly endpoint: string = '/alunos';

  constructor(private http: HttpClient) {}

  private create(record: Partial<Aluno>) {
    return this.http.post<Aluno>(
      `${environment.API_URL}${this.endpoint + '/novo'}`,
      record
    );
  }

  public update(record: Partial<Aluno>) {
    return this.http
      .put<Aluno>(`${environment.API_URL}${this.endpoint}/${record.id}`, record)
      .pipe(first());
  }

  save(record: Partial<Aluno>) {
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

  public findById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${environment.API_URL}${this.endpoint}/${id}`);
  }

  findByNameAluno(nome: string): Observable<Aluno[]> {
    return this.http
      .get<Aluno[]>(`${environment.API_URL}${this.endpoint}` + '/search', {
        params: { q: nome },
      })
      .pipe(
        map((alunos) =>
          alunos.filter((aluno) =>
            aluno.nome.toLowerCase().includes(nome.toLowerCase())
          )
        )
      );
  }

  private alunoSelecionadoSubject = new BehaviorSubject<Aluno>(null);

  alunoSelecionado: Observable<Aluno> = this.alunoSelecionadoSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  selecionarAluno(aluno: Aluno) {
    if (aluno && !this.alunoSelecionadoSubject.value?.id) {
      this.alunoSelecionadoSubject.next(aluno);
    }
  }
}
