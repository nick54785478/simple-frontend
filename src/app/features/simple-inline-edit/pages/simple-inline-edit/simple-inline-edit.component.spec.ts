import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleInlineEditComponent } from './simple-inline-edit.component';

describe('SimpleInlineEditComponent', () => {
  let component: SimpleInlineEditComponent;
  let fixture: ComponentFixture<SimpleInlineEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleInlineEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleInlineEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
