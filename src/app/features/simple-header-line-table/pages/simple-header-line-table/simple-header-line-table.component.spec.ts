import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleHeaderLineTableComponent } from './simple-header-line-table.component';

describe('SimpleHeaderLineTableComponent', () => {
  let component: SimpleHeaderLineTableComponent;
  let fixture: ComponentFixture<SimpleHeaderLineTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleHeaderLineTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleHeaderLineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
