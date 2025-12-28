import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SystemMessageService } from '../../../core/services/system-message.service';
import { LoadingMaskService } from '../../../core/services/loading-mask.service';
import { MenuItem, TreeNode } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';

/**
 * 定義基礎的 Form 表單 Component
 */
@Component({
  selector: 'app-base-fta-compoent',
  standalone: true,
  imports: [],
  providers: [],
  template: '',
})
export abstract class BaseFtaCompoent implements OnInit, OnDestroy {
  protected loadingMaskService = inject(LoadingMaskService);
  protected messageService = inject(SystemMessageService);

  /**
   * Fta 樹狀資料
   */
  protected ftaData: TreeNode[] = [
    {
      label: '頂事件 (Top Event)',
      expanded: true,
      children: [
        {
          label: 'AND Gate',
          expanded: true,
          children: [{ label: '基礎事件 A' }, { label: '基礎事件 B' }],
        },
      ],
    },
  ];

  /**
   * 選擇的節點
   */
  protected selectedNode: TreeNode | null = null;

  /**
   * 用來判斷是否開啟 Dialog
   */
  dialogOpened: boolean = false;

  /**
   * 監聽 ContextMenu Component
   */
  @ViewChild('cm') protected contextMenu!: ContextMenu;

  /**
   * ContextMenu 右鍵事件設置
   */
  protected menuItems: MenuItem[] = [
    {
      label: '新增子節點',
      icon: 'pi pi-plus',
      command: () => this.addNode(this.selectedNode),
    },
    {
      label: '編輯節點',
      icon: 'pi pi-pencil',
      command: () => this.editNode(this.selectedNode),
    },
    {
      label: '刪除節點',
      icon: 'pi pi-trash',
      command: () => this.deleteNode(this.selectedNode),
    },
  ];

  /**
   * 定義 Form Group
   * */
  protected formGroup!: FormGroup;

  /**
   * 用於 Submit 用
   */
  protected submitted: boolean = false;

  /**
   * 表單動作
   */
  protected formAction!: string;

  constructor() {}

  /**
   * OnInit 初始化動作
   */
  ngOnInit(): void {
    this.resetState(); // 初始化
  }

  /**
   * OnDestroy 用於 Component 生命週期結束前的動作
   */
  ngOnDestroy(): void {}

  /**
   * Patch FormGroup 的值
   * @param data
   */
  patchFormGroupValue(data?: any) {}

  /**
   * 取得 FormControl。
   * @param formControlName formControlNameformControl 的名稱
   * @returns FormControl
   */
  formControl(formControlName: string): FormControl {
    return this.formGroup.get(formControlName) as FormControl;
  }

  /**
   * 判斷 formControl 欄位是否有錯誤。
   * @param formControlName formControl 的名稱
   * @returns boolean 欄位是否有錯誤
   */
  formControlInvalid(formControlName: string): boolean {
    const formControl = this.formGroup.get(formControlName);
    if (formControl) {
      return formControl.invalid && (formControl.dirty || this.submitted);
    } else {
      return false;
    }
  }

  /**
   * 展開節點
   * @param event
   */
  onExpand(event: { node: TreeNode }) {
    console.log('展開節點:', event.node);
    event.node.expanded = true;
  }

  /**
   * 右鍵點擊節點時觸發
   * @param event
   * @param node
   */
  onContextMenu(event: MouseEvent, node: TreeNode) {
    this.selectedNode = node; // 設定被選中的節點
    this.contextMenu.show(event); // 顯示右鍵選單
    event.preventDefault(); // 阻止瀏覽器預設的右鍵行為
  }

  /**
   * 新增子節點
   * @param node
   * @returns
   */
  addNode(node: TreeNode | null) {
    if (!node) {
      return;
    }
    node.children = node.children || [];
    node.children.push({ label: '新事件' });
  }

  /**
   * 編輯節點名稱
   * @param node
   * @returns
   */
  editNode(node: TreeNode | null) {
    if (!node) {
      return;
    }
    const newLabel = prompt('輸入新名稱', node.label || ''); // 使用 prompt 取得新名稱
    if (newLabel) {
      node.label = newLabel; // 如果使用者輸入了名稱，就更新節點的 label
    }
  }

  /**
   * 刪除節點
   * @param node
   * @returns
   */
  deleteNode(node: TreeNode | null) {
    // 如果節點不存在則直接返回
    if (!node) {
      return;
    }
    // 遞迴處理子節點
    this.recursiveDelete(this.ftaData, node);
  }

  /**
   * 遞迴處理子節點
   * @param nodes
   * @param target
   * @returns
   */
  private recursiveDelete(nodes: TreeNode[], target: TreeNode): boolean {
    const index = nodes.indexOf(target);
    if (index > -1) {
      nodes.splice(index, 1);
      return true;
    }
    for (const n of nodes) {
      if (n.children && this.recursiveDelete(n.children, target)) {
        if (n.children.length === 0) {
          delete n.children;
        }
        return true; // 刪除成功，回傳 true
      }
    }
    return false; // 沒有找到節點，回傳 false
  }

  /**
   * 提交資料
   */
  submit() {}

  /**
   * 取消
   */
  cancel() {}

  /**
   * 初始化狀態
   */
  private resetState() {
    this.dialogOpened = false;
    this.formGroup = new FormGroup({});
    this.submitted = false;
  }
}
