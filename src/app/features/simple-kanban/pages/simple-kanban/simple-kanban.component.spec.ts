import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleKanbanComponent } from './simple-kanban.component';

describe('SimpleKanbanComponent', () => {
  let component: SimpleKanbanComponent;
  let fixture: ComponentFixture<SimpleKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleKanbanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
