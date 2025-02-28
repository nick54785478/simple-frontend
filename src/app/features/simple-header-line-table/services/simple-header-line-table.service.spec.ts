import { TestBed } from '@angular/core/testing';

import { SimpleHeaderLineTableService } from './simple-header-line-table.service';

describe('SimpleHeaderLineTableService', () => {
  let service: SimpleHeaderLineTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleHeaderLineTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
