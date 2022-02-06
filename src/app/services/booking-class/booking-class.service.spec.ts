import { TestBed } from '@angular/core/testing';

import { BookingClassService } from './booking-class.service';

describe('BookingClassService', () => {
  let service: BookingClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
