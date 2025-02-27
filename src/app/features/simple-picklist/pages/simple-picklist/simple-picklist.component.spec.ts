import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplePicklistComponent } from './simple-picklist.component';

describe('SimplePicklistComponent', () => {
  let component: SimplePicklistComponent;
  let fixture: ComponentFixture<SimplePicklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimplePicklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimplePicklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
