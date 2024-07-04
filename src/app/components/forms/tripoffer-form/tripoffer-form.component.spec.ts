import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripofferFormComponent } from './tripoffer-form.component';

describe('TripofferFormComponent', () => {
  let component: TripofferFormComponent;
  let fixture: ComponentFixture<TripofferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TripofferFormComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripofferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
