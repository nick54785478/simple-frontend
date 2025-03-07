import { TestBed } from '@angular/core/testing';

import { DynamicGeneratingService } from './dynamic-generating.service';

describe('DynamicGeneratingService', () => {
  let service: DynamicGeneratingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicGeneratingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
