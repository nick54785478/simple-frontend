import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model ';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { Option } from '../../../../shared/models/option.model';
import { DialogConfirmService } from '../../../../core/services/dialog-confirm.service';

@Component({
  selector: 'app-simple-kanban',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [DialogConfirmService],
  templateUrl: './simple-kanban.component.html',
  styleUrl: './simple-kanban.component.scss',
})
export class SimpleKanbanComponent implements OnInit {
  // 泳道
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  persons: Option[] = [];

  dragOverIndex: number | null = null;

  draggedTask: Task | null = null; // 被拖拉的卡片
  editingTaskId: string | null = null; // 正在編輯的 Task id
  clonedTask: Task | null = null; // 暫存編輯中的資料

  constructor(private dialogConfirmService: DialogConfirmService) {}

  ngOnInit() {
    this.persons = [
      { id: '', label: 'Alice', value: 'Alice' },
      { id: '', label: 'Bob', value: 'Bob' },
      { id: '', label: 'Charlie', value: 'Charlie' },
      // 其他人員
    ];
    // 初始資料
    this.todo = [
      {
        id: '1',
        title: 'Define requirements',
        status: 'TODO',
        responsiblePerson: 'Alice',
        dueDate: '2025-12-10',
        remark: '待確認細節',
      },
      {
        id: '2',
        title: 'Prepare environment',
        status: 'TODO',
        responsiblePerson: 'Bob',
        dueDate: '2025-10-10',
        remark: '伺服器尚未配置',
      },
    ];
    this.inProgress = [
      {
        id: '3',
        title: 'Develop feature A',
        status: 'IN_PROGRESS',
        responsiblePerson: 'Charlie',
        dueDate: '2025-10-10',
        remark: '進度 60%',
      },
    ];
    this.done = [
      {
        id: '4',
        title: 'Setup Git repo',
        status: 'DONE',
        responsiblePerson: 'David',
        dueDate: '2025-09-01',
        remark: '已完成',
      },
    ];
  }

  /**
   * 執行拖拉動作
   * @param task
   */
  dragStart(task: Task) {
    this.draggedTask = task;
  }

  /**
   * 拖拉卡片
   */
  drop(
    targetList: Task[],
    newStatus: Task['status'],
    listName: 'todo' | 'inProgress' | 'done',
    dropIndex?: number
  ) {
    if (this.draggedTask) {
      const isSameList = this.draggedTask.status === newStatus;

      if (isSameList) {
        // 🟢 同一個泳道 → 單純排序
        const list = [...targetList];
        const oldIndex = list.findIndex((t) => t.id === this.draggedTask!.id);

        if (oldIndex > -1) {
          // 先移除
          list.splice(oldIndex, 1);

          // 插回 dropIndex (注意 index 位移問題)
          const insertIndex =
            dropIndex! > oldIndex ? dropIndex! - 1 : dropIndex!;
          list.splice(insertIndex, 0, this.draggedTask);
        }

        this[listName] = list;
      } else {
        // 🟡 跨泳道 → 移除舊的，再插入新的泳道
        this.removeTask(this.draggedTask);
        this.draggedTask.status = newStatus;

        const newList = [...targetList];
        if (dropIndex !== undefined) {
          newList.splice(dropIndex, 0, this.draggedTask);
        } else {
          newList.push(this.draggedTask);
        }

        this[listName] = newList;
      }

      // 用局部變數記住被 drop 的卡片
      const droppedTask = this.draggedTask;

      droppedTask.flash = true;
      setTimeout(() => (droppedTask.flash = false), 1500); // 動畫時間可以調長一點

      this.draggedTask = null;
    }
  }

  /**
   * 放掉已被拖拉的卡片
   */
  dragEnd() {
    this.draggedTask = null;
  }

  /**
   * 刪除該泳道的任務卡片
   * @param task 任務卡片
   */
  private removeTask(task: Task) {
    this.todo = this.todo.filter((t) => t.id !== task.id);
    this.inProgress = this.inProgress.filter((t) => t.id !== task.id);
    this.done = this.done.filter((t) => t.id !== task.id);
  }

  dragOver(event: any, task: Task, list: Task[]) {
    event.preventDefault(); // 允許 drop

    const targetElement = event.currentTarget as HTMLElement;
    const rect = targetElement.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;

    const targetIndex = list.findIndex((t) => t.id === task.id);

    // 判斷滑鼠在目標卡片的上半區 or 下半區
    this.dragOverIndex =
      offsetY < rect.height / 2 ? targetIndex : targetIndex + 1;
  }

  /**
   * 新增資料
   */
  addTask() {
    const newTask: Task = {
      id: crypto.randomUUID(), // 或用 uuid library
      title: 'New Task',
      status: 'TODO',
      responsiblePerson: 'Unassigned',
      dueDate: '',
      remark: '',
    };

    // 只在 TODO 泳道新增
    this.todo = [...this.todo, newTask];
  }

  /**
   * 進入編輯模式
   */
  onEdit(task: Task) {
    this.editingTaskId = task.id;
    this.clonedTask = { ...task };
  }

  /**
   * 儲存修改
   */
  onSave(listName: 'todo' | 'inProgress' | 'done') {
    if (!this.clonedTask) return;

    this[listName] = this[listName].map((t) =>
      t.id === this.editingTaskId ? this.clonedTask! : t
    );

    this.cancelEdit();
  }

  /**
   * 取消編輯
   */
  cancelEdit() {
    this.editingTaskId = null;
    this.clonedTask = null;
  }

  /**
   * 轉換用 Record
   */
  public statusLabels: Record<string, string> = {
    TODO: 'To do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  };

  /**
   * 刪除資料
   * @param task
   * @param lane Swimlane 名稱 (planned / inProgress / completed)
   */
  onDelete(task: Task, lane: string) {
    this.dialogConfirmService.confirmDelete(() => {
      // ✅ 同步移除前端資料
      if (lane === 'todo') {
        this.todo = this.todo.filter((t) => t.id !== task.id);
      } else if (lane === 'inProgress') {
        this.inProgress = this.inProgress.filter((t) => t.id !== task.id);
      } else if (lane === 'completed') {
        this.done = this.done.filter((t) => t.id !== task.id);
      }
    });
  }
}
