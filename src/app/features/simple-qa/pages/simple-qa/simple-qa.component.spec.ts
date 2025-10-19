import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleQaComponent } from './simple-qa.component';

describe('SimpleQaComponent', () => {
  let component: SimpleQaComponent;
  let fixture: ComponentFixture<SimpleQaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleQaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
