import { TestBed } from '@angular/core/testing';

import { ExpectationsService } from './expectations.service';

describe('ExpectationsService', () => {
  let service: ExpectationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpectationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
