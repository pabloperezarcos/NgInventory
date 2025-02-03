import { TestBed } from '@angular/core/testing';

import { ConsultarInventarioService } from './consultar-inventario.service';

describe('ConsultarInventarioService', () => {
  let service: ConsultarInventarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultarInventarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
