import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTripofferComponent } from './edit-tripoffer.component';

describe('EditTripofferComponent', () => {
  let component: EditTripofferComponent;
  let fixture: ComponentFixture<EditTripofferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTripofferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTripofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
