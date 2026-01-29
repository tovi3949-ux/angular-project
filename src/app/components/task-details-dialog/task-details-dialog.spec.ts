import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsDialog } from './task-details-dialog';

describe('TaskDetailsDialog', () => {
  let component: TaskDetailsDialog;
  let fixture: ComponentFixture<TaskDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
