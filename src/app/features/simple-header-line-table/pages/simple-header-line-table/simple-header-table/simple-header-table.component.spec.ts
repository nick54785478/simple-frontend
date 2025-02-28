import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleHeaderTableComponent } from './simple-header-table.component';

describe('SimpleHeaderTableComponent', () => {
  let component: SimpleHeaderTableComponent;
  let fixture: ComponentFixture<SimpleHeaderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleHeaderTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleHeaderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
