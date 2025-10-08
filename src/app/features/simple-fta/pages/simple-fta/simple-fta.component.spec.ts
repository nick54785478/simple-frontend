import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFtaComponent } from './simple-fta.component';

describe('SimpleFtaComponent', () => {
  let component: SimpleFtaComponent;
  let fixture: ComponentFixture<SimpleFtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleFtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleFtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
