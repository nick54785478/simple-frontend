import { TestBed } from '@angular/core/testing';

import { FishboneService } from './fishbone.service';

describe('FishboneService', () => {
  let service: FishboneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FishboneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
