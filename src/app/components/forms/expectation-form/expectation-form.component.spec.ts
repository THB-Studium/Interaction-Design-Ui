import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectationFormComponent } from './expectation-form.component';

describe('ExpectationFormComponent', () => {
  let component: ExpectationFormComponent;
  let fixture: ComponentFixture<ExpectationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpectationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
