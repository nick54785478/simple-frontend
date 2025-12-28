import { TestBed } from '@angular/core/testing';

import { FtaService } from './fta.service';

describe('FtaService', () => {
  let service: FtaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FtaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
