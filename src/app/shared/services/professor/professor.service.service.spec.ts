import { TestBed } from '@angular/core/testing';
import { ProfessorService } from './professor.service.service';

describe('AlunoServiceService', () => {
  let service: ProfessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
