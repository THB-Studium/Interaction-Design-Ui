import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripofferComponent } from './tripoffer.component';

describe('TripofferComponent', () => {
  let component: TripofferComponent;
  let fixture: ComponentFixture<TripofferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripofferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
