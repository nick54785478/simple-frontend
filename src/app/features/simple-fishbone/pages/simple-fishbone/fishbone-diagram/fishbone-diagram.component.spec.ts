import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FishboneDiagramComponent } from './fishbone-diagram.component';

describe('FishboneDiagramComponent', () => {
  let component: FishboneDiagramComponent;
  let fixture: ComponentFixture<FishboneDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FishboneDiagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FishboneDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
