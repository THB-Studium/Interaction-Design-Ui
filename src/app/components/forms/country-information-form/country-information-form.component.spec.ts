import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryInformationFormComponent } from './country-information-form.component';

describe('CountryInformationFormComponent', () => {
  let component: CountryInformationFormComponent;
  let fixture: ComponentFixture<CountryInformationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CountryInformationFormComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
