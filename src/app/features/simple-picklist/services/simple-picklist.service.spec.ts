import { TestBed } from '@angular/core/testing';

import { SimplePicklistService } from './simple-picklist.service';

describe('SimplePicklistService', () => {
  let service: SimplePicklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimplePicklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
