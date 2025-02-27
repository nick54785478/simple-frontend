import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFormTableComponent } from './simple-form-table.component';

describe('SimpleFormTableComponent', () => {
  let component: SimpleFormTableComponent;
  let fixture: ComponentFixture<SimpleFormTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleFormTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleFormTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
