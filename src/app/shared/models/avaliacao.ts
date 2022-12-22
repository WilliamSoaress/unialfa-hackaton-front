import { Aluno } from './aluno';
import { ChipEvolucaoIMC } from './ChipEvolucaoIMC';
import { Professor } from './professor';

export interface Avaliacao {
  id: number;
  data: Date;
  aluno: Aluno;
  professor: Professor;
  idadeAluno: number;
  alturaAluno: number;
  pesoAluno: number;
  imc: number;
  evolucaoImc: number;
  classificationIMC: string;
  colorIMC: string;
  chipEvolucaoIMC: ChipEvolucaoIMC;
}
