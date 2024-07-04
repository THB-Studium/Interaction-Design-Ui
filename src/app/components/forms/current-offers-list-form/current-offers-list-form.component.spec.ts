import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentOffersListFormComponent } from './current-offers-list-form.component';

describe('CurrentOffersListFormComponent', () => {
  let component: CurrentOffersListFormComponent;
  let fixture: ComponentFixture<CurrentOffersListFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CurrentOffersListFormComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentOffersListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
