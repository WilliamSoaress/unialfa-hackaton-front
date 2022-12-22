import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable, catchError, of, startWith, map } from 'rxjs';
import { GenericDialogComponent } from 'src/app/components/dialog/generic-dialog/generic-dialog.component';
import { Avaliacao } from 'src/app/shared/models/avaliacao';
import { ChipEvolucaoIMC } from 'src/app/shared/models/ChipEvolucaoIMC';
import { Page } from 'src/app/shared/models/page';
import { AvaliacaoService } from 'src/app/shared/services/avaliacao/avaliacao.service.service';
import { AuthService } from 'src/app/shared/services/usuario/auth-service.service';

@Component({
  selector: 'app-avaliacoes',
  templateUrl: './avaliacoes.component.html',
  styleUrls: ['./avaliacoes.component.css'],
})
export class AvaliacoesComponent implements OnInit {
  currentPage = 0;
  pageSize = 20;
  length = 50;
  pageEvent!: PageEvent;
  pageIndex = 0;
  avaliacoes: Page<Avaliacao> = new Page<Avaliacao>();
  searchControl = new FormControl();
  filteredEvaluations!: Observable<Avaliacao[]>;
  classificationIMC!: string;
  colorIMC!: string;
  evolucaoImc!: number;
  chipText!: string;
  chipColor!: string;

  constructor(
    private avaliacaoService: AvaliacaoService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.redirect();
    this.getEvaluationsPage();
  }

  redirect() {
    let estaLogado = this.authService.isLoggedIn();
    if (!estaLogado) {
      return this.router.navigateByUrl('/login');
    }
    return null;
  }

  filterEvaluations(value: string): Avaliacao[] {
    if (!this.avaliacoes || !this.avaliacoes.content) {
      return [];
    }
    return this.avaliacoes.content.filter((avaliacao) => {
      return avaliacao.aluno.nome.toLowerCase().includes(value.toLowerCase());
    });
  }

  search() {
    this.currentPage = 0;
    this.getEvaluationsPage();
  }

  getEvaluationsPage() {
    this.avaliacaoService
      .getEvaluations(this.searchControl.value, this.currentPage, this.pageSize)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            console.error('Ocorreu um erro de rede:', error.error.message);
          } else {
            console.error(
              `Código de erro da API: ${error.status}, ` +
                `mensagem: ${error.message}`
            );
          }
          this.openDialogError();
          return of(null);
        })
      )
      .subscribe((page: any) => {
        if (!page) {
          return;
        }
        this.avaliacoes = page;
        if (this.avaliacoes.content && Array.isArray(this.avaliacoes.content)) {
          this.avaliacoes.content.forEach((avaliacao: any) => {
            if (avaliacao.imc !== undefined) {
              this.classifyIMC(avaliacao.imc, avaliacao);
              this.updateChip(avaliacao);
            }
          });
        }
        this.filteredEvaluations = this.searchControl.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterEvaluations(value))
        );
      });
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getEvaluationsPage();
    }
  }

  nextPage() {
    if (this.avaliacoes.hasNext()) {
      this.currentPage++;
      this.getEvaluationsPage();
    }
  }

  updateChip(avaliacao: Avaliacao) {
    let chip: ChipEvolucaoIMC;
    if (avaliacao.evolucaoImc > 0) {
      chip = {
        texto: `Aumento de ${avaliacao.evolucaoImc.toFixed(2)}% no IMC!`,
        cor: '#f44336',
      };
    } else if (avaliacao.evolucaoImc < 0) {
      chip = {
        texto: `Diminuição de ${avaliacao.evolucaoImc.toFixed(2)}%!`,
        cor: '#66bb6a',
      };
    } else {
      chip = {
        texto: 'Estável!',
        cor: '#ffa726',
      };
    }
    avaliacao.chipEvolucaoIMC = chip;
  }

  classifyIMC(imc: number, avaliacao: Avaliacao): void {
    let classification: string;
    let color: string;

    if (imc < 18.5) {
      classification = 'Abaixo do peso';
      color = '#29b6f6';
    } else if (imc >= 18.5 && imc <= 24.9) {
      classification = 'Peso normal';
      color = '#66bb6a';
    } else if (imc >= 25 && imc <= 29.9) {
      classification = 'Sobrepeso';
      color = '#ffa726';
    } else {
      classification = 'Obesidade';
      color = '#f44336';
    }

    avaliacao.classificationIMC = classification;
    avaliacao.colorIMC = color;
  }

  handlePageEvent(event: PageEvent) {
    this.avaliacaoService
      .getEvaluations('', event.pageIndex, event.pageSize)
      .subscribe((page) => {
        this.avaliacoes = page;
        this.avaliacoes.content.forEach((avaliacao) => {
          this.classifyIMC(avaliacao.imc, avaliacao);
        });
        this.filteredEvaluations = this.searchControl.valueChanges.pipe(
          startWith(''),
          map((value) => this.filterEvaluations(value))
        );
      });
    return event;
  }

  openDialogError() {
    this.dialog.open(GenericDialogComponent, {
      data: {
        titulo: 'Erro',
        mensagem: 'Ocorreu um erro ao obter as avaliações.',
      },
    });
  }
}
