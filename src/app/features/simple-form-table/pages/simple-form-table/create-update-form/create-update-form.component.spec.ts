import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateFormComponent } from './create-update-form.component';

describe('CreateUpdateFormComponent', () => {
  let component: CreateUpdateFormComponent;
  let fixture: ComponentFixture<CreateUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
