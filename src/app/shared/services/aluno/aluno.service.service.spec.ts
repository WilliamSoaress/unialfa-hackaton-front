import { TestBed } from '@angular/core/testing';
import { AlunoService } from './aluno.service.service';

describe('AlunoServiceService', () => {
  let service: AlunoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlunoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
