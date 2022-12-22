import { map, Observable } from 'rxjs';
import { Avaliacao } from 'src/app/shared/models/avaliacao';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CanvasJS } from 'src/assets/canvasjs.angular.component';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { Aluno } from 'src/app/shared/models/aluno';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/usuario/auth-service.service';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css'],
})
export class GraficosComponent {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.formGroup = new FormGroup({});
  }

  avaliacoes: Avaliacao[];
  nomeAlunoCtrl = new FormControl();
  alunos: Aluno[] = [];
  alunoSelecionado: Aluno;
  formGroup: FormGroup;

  ngOnInit() {
    this.redirect();
    this.autoCompleteAluno();
  }

  redirect() {
    let estaLogado = this.authService.isLoggedIn();
    if (!estaLogado) {
      return this.router.navigateByUrl('/login');
    }
    return null;
  }

  findByNameAluno(nome: string): Observable<Aluno[]> {
    return this.http
      .get<Aluno[]>(`${environment.API_URL}/alunos/search`, {
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

  capturarAluno(aluno: Aluno) {
    this.alunoSelecionado = aluno;
    this.createChart(aluno.id);
  }

  displayFnAluno(aluno?: Aluno): string {
    return aluno ? aluno.nome : '';
  }

  autoCompleteAluno() {
    this.nomeAlunoCtrl.valueChanges.subscribe((nome) => {
      if (nome.length >= 1) {
        this.findByNameAluno(nome).subscribe((alunos: Aluno[]) => {
          this.alunos = alunos;
        });
      } else {
        if (this.alunos.length > 1) {
          this.alunos = [];
        }
      }
    });
  }

  createChart(alunoId: number) {
    this.http
      .get<Avaliacao[]>(`${environment.API_URL}/avaliacoes/aluno/${alunoId}`)
      .subscribe(
        (avaliacoes) => {
          this.avaliacoes = avaliacoes;
          const dataPoints: { x: Date; y: number }[] = [];
          avaliacoes.forEach((avaliacao) => {
            dataPoints.push({
              x: new Date(avaliacao.data),
              y: avaliacao.imc,
            });
          });

          const chart = new CanvasJS.Chart('chartContainer', {
            title: {
              text: 'Evolução do IMC do Aluno',
              fontSize: 20,
              fontColor: '#6D6E70',
            },
            animationEnabled: true,
            exportEnabled: true,
            dataPointWidth: 50,
            axisX: {
              labelFormatter: function (e: { value: moment.MomentInput }) {
                return moment(e.value).format('MM/YYYY');
              },
              fontSize: 1,
              interval: 1,
              intervalType: 'month',
              minimum: new Date(2022, 1, 1),
              labelFontColor: '#6D6E70',
              lineColor: '#6D6E70',
              labelFontSize: 10,
              labelTextAlign: 'right',
              title: `Aluno: ${this.avaliacoes[0].aluno.nome}`,
              titleFontColor: '#6D6E70',
            },
            axisY: {
              labelFontColor: '#6D6E70',
              lineColor: '#6D6E70',
            },
            data: [
              {
                type: 'column',
                dataPoints: dataPoints,
                barThickness: 1,
              },
            ],
          });

          chart.render();
        },
      );
  }
}
