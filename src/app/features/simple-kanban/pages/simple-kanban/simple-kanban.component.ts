import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model ';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-kanban',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './simple-kanban.component.html',
  styleUrl: './simple-kanban.component.scss',
})
export class SimpleKanbanComponent implements OnInit {
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  draggedTask: Task | null = null;

  ngOnInit() {
    // 初始資料
    this.todo = [
      {
        id: '1',
        title: 'Define requirements',
        status: 'TODO',
        responsiblePerson: 'Alice',
        remark: '待確認細節',
      },
      {
        id: '2',
        title: 'Prepare environment',
        status: 'TODO',
        responsiblePerson: 'Bob',
        remark: '伺服器尚未配置',
      },
    ];
    this.inProgress = [
      {
        id: '3',
        title: 'Develop feature A',
        status: 'IN_PROGRESS',
        responsiblePerson: 'Charlie',
        remark: '進度 60%',
      },
    ];
    this.done = [
      {
        id: '4',
        title: 'Setup Git repo',
        status: 'DONE',
        responsiblePerson: 'David',
        remark: '已完成',
      },
    ];
  }

  dragStart(task: Task) {
    this.draggedTask = task;
  }

  drop(
    targetList: Task[],
    newStatus: Task['status'],
    listName: 'todo' | 'inProgress' | 'done'
  ) {
    if (this.draggedTask) {
      // 先把它從舊清單移除
      this.removeTask(this.draggedTask);

      // 更新狀態
      this.draggedTask.status = newStatus;

      // 放到新的泳道
      // 用展開運算子製造新陣列，確保 Angular 偵測到變化
      this[listName] = [...targetList, this.draggedTask];

      console.log(targetList);

      this.draggedTask = null;
    }
  }

  dragEnd() {
    this.draggedTask = null;
  }

  private removeTask(task: Task) {
    this.todo = this.todo.filter((t) => t.id !== task.id);
    this.inProgress = this.inProgress.filter((t) => t.id !== task.id);
    this.done = this.done.filter((t) => t.id !== task.id);
  }
}
