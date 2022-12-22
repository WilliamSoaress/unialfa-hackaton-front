import { ProfessorService } from './../../shared/services/professor/professor.service.service';
import { Aluno } from './../../shared/models/aluno';
import { AvaliacaoService } from './../../shared/services/avaliacao/avaliacao.service.service';

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AlunoService } from 'src/app/shared/services/aluno/aluno.service.service';
import { Professor } from 'src/app/shared/models/professor';
import { MatDialog } from '@angular/material/dialog';
import { GenericDialogComponent } from 'src/app/components/dialog/generic-dialog/generic-dialog.component';
import { AuthService } from 'src/app/shared/services/usuario/auth-service.service';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.css'],
})
export class AvaliacaoComponent implements OnInit {
  //Formulário para preenchimento dos dados
  form!: FormGroup;

  nomeAlunoCtrl = new FormControl();
  nomeProfessorCtrl = new FormControl();
  alunos: Aluno[] = [];
  professores: Professor[] = [];
  aluno: Aluno | undefined;
  professor: Professor | undefined;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private alunoService: AlunoService,
    private avaliacaoService: AvaliacaoService,
    private professorService: ProfessorService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.redirect();
    this.form = this.fb.group({
      id: [null],
      aluno: [null, [Validators.required]],
      professor: [null, [Validators.required]],
      idadeAluno: ['', [Validators.required]],
      alturaAluno: ['', [Validators.required]],
      pesoAluno: ['', [Validators.required]],
      imc: ['', [Validators.required]],
    });
    this.autoComplete();
    this.autoCompleteProfessor();
  }

  redirect() {
    let estaLogado = this.authService.isLoggedIn();
    if (!estaLogado) {
      return this.router.navigateByUrl('/login');
    }
    return null;
  }

  /**
   * Finaliza o preenchimento do formulário, realizando sua inclusão na base de dados
   */
  submit() {
    if (this.form.invalid) {
      this.openDialogError();
      return;
    }

    this.avaliacaoService.save(this.form.value).subscribe({
      next: (data) => {
        console.log(`Salvando a avaliação do aluno ${data.aluno.nome}`);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('O registro foi salvo com sucesso!');
        this.location.back();
      },
    });
  }

  /**
   * Ao cancelar, volta para a página anterior
   */
  cancel() {
    this.location.back();
  }

  /**
   * Provê um conjunto de mensagens de erro a serem apresentados no campo conforme sua validação no FormGroup
   * @param control Form control que terá o erro verificado
   * @returns Mensagem de erro a ser apresentada no campo
   */
  getErrorMessage(control: any) {
    if (this.form.controls[control].hasError('required')) {
      return 'É obrigatório o preenchimento do campo';
    } else if (this.form.controls[control].hasError('minlength')) {
      return 'Existe uma quantidade mínima de caracteres';
    } else if (this.form.controls[control].hasError('maxlength')) {
      return 'Existe uma quantidade máxima de caracteres';
    }

    return this.form.controls[control].hasError('email')
      ? 'Este não é um email válido'
      : 'teste';
  }

  autoComplete() {
    this.nomeAlunoCtrl.valueChanges.subscribe((nome) => {
      if (nome.length >= 1) {
        this.alunoService.findByNameAluno(nome).subscribe((alunos: Aluno[]) => {
          this.alunos = alunos;
        });
      } else {
        if (this.alunos.length > 1) {
          this.alunos = [];
        }
      }
    });
  }

  autoCompleteProfessor() {
    this.nomeProfessorCtrl.valueChanges.subscribe((nome) => {
      if (nome.length >= 1) {
        this.professorService
          .findByNameProfessor(nome)
          .subscribe((professores: Professor[]) => {
            this.professores = professores;
          });
      } else {
        if (this.professores.length > 1) {
          this.professores = [];
        }
      }
    });
  }

  capturarAluno(aluno: Aluno) {
    this.aluno = aluno;
    this.form?.get('aluno')?.setValue(this.aluno);
  }

  capturarProfessor(professor: Professor) {
    this.professor = professor;
    this.form?.get('professor')?.setValue(this.professor);
  }

  displayFnAluno(aluno?: Aluno): string {
    return aluno ? aluno.nome : '';
  }

  displayFnProfessor(professor?: Professor): string {
    return professor ? professor.nome : '';
  }

  calcularIMC(peso: number, altura: number): number {
    const imc = peso / (altura * altura);
    return Number(imc.toFixed(2));
  }

  gerarImc() {
    if (this.form) {
      const altura = this.form.get('alturaAluno')!.value;
      const peso = this.form.get('pesoAluno')!.value;

      this.form.get('imc')!.setValue(this.calcularIMC(peso, altura));
    }
  }

  openDialogError() {
    this.dialog.open(GenericDialogComponent, {
      data: {
        titulo: 'Erro',
        mensagem: 'Existem campos vazios no formulário',
      },
    });
  }
}
