import { TestBed } from '@angular/core/testing';

import { NewsLettersService } from './news-letters.service';

describe('NewsLettersService', () => {
  let service: NewsLettersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsLettersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
