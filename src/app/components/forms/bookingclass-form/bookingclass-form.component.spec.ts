import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingclassFormComponent } from './bookingclass-form.component';

describe('BookingclassFormComponent', () => {
  let component: BookingclassFormComponent;
  let fixture: ComponentFixture<BookingclassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingclassFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingclassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
