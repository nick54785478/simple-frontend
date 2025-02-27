import { TestBed } from '@angular/core/testing';
import { SimpleFormTableService } from './simple-form-table.service';

describe('SimpleFormTableService', () => {
  let service: SimpleFormTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleFormTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
