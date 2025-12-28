import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFishboneComponent } from './simple-fishbone.component';

describe('SimpleFishboneComponent', () => {
  let component: SimpleFishboneComponent;
  let fixture: ComponentFixture<SimpleFishboneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleFishboneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleFishboneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
