import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleLineTableComponent } from './simple-line-table.component';

describe('SimpleLineTableComponent', () => {
  let component: SimpleLineTableComponent;
  let fixture: ComponentFixture<SimpleLineTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleLineTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleLineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
