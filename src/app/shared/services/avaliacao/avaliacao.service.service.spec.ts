import { TestBed } from '@angular/core/testing';
import { AvaliacaoService } from './avaliacao.service.service';


describe('AvaliacaoServiceService', () => {
  let service: AvaliacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvaliacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
