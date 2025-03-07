import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicGeneratingComponent } from './dynamic-generating.component';

describe('DynamicGeneratingComponent', () => {
  let component: DynamicGeneratingComponent;
  let fixture: ComponentFixture<DynamicGeneratingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicGeneratingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicGeneratingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
