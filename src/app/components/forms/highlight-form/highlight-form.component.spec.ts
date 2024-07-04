import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightFormComponent } from './highlight-form.component';

describe('HighlightFormComponent', () => {
  let component: HighlightFormComponent;
  let fixture: ComponentFixture<HighlightFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HighlightFormComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
