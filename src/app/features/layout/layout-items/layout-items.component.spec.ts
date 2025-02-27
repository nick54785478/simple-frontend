import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutItemsComponent } from './layout-items.component';

describe('LayoutItemsComponent', () => {
  let component: LayoutItemsComponent;
  let fixture: ComponentFixture<LayoutItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
