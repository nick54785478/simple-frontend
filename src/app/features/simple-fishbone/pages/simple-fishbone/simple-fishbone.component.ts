import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  SaveFishboneDiagramResource,
  SaveFishboneNode,
  SaveFishbonTitle,
} from '../../models/save-fishbone-diagram.model';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { FishboneDiagramComponent } from './fishbone-diagram/fishbone-diagram.component';
import { DialogFormComponent } from '../../../../shared/component/dialog-form/dialog-form.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseFormCompoent } from '../../../../shared/component/base/base-form.component';
import { MenuItem, TreeNode } from 'primeng/api';
import { DialogConfirmService } from '../../../../core/services/dialog-confirm.service';
import { Subject } from 'rxjs/internal/Subject';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FishboneService } from '../../services/fishbone.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { SystemMessageService } from '../../../../core/services/system-message.service';

@Component({
  selector: 'app-simple-fishbone',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [
    SystemMessageService,
    DialogConfirmService,
    DialogService,
    DynamicDialogRef,
  ],
  templateUrl: './simple-fishbone.component.html',
  styleUrl: './simple-fishbone.component.scss',
})
export class SimpleFishboneComponent
  extends BaseFormCompoent
  implements OnInit
{
  files!: TreeNode[]; // 樹狀結構
  cols!: any[];

  // problemUuid 此處假設與問題單綁定
  problemUuid!: string;

  /**
   * 用來取消訂閱
   */
  readonly _destroying$ = new Subject<void>();

  constructor(
    private dialogConfirmService: DialogConfirmService,
    private fishboneService: FishboneService,
    public dialogService: DialogService
  ) {
    super();
  }

  override ngOnInit() {
    this.problemUuid = crypto.randomUUID();

    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
    });

    // 取得 Fishbone 架構資料
    this.fishboneService.getFishbone(this.problemUuid).subscribe((res) => {
      this.files = this.transformToTreeNodes(res);
    });

    this.detailTabs = [
      {
        label: '預覽',
        icon: 'pi pi-eye',
        command: () => {
          this.preview(this.files);
        },
        disabled: false,
      },
      {
        label: '儲存',
        icon: 'pi pi-save',
        command: () => {
          this.save();
        },
        disabled: false,
      },
    ];

    this.cols = [{ field: 'name', header: '魚骨圖配置' }];
  }

  /**
   * 將後端 JSON 轉為 TreeNode 並生成 UUID
   * */
  private transformToTreeNodes(data: any[]): TreeNode[] {
    console.log(data);
    return data.map((node) => {
      return this.createTreeNode(node);
    });
  }

  /**
   * 建立 TreeNode
   * @param node 當前節點
   * @param parent 父節點
   * @returns
   */
  private createTreeNode(node: any, parent?: TreeNode): TreeNode {
    const treeNode: TreeNode = {
      key: crypto.randomUUID(),
      // 三層邏輯：
      // 如果原始節點 node.data.name 存在，就用它。
      // 如果沒有，就用 node.name。
      // 如果兩者都沒有，就用 '未命名' 作為預設值。
      data: { name: node.data?.name ?? node.name ?? '未命名' },
      children: node.children
        ? node.children.map((child: any) =>
            this.createTreeNode(child, undefined)
          )
        : [],
    };

    // 給每個子節點設定 parent。
    if (treeNode.children) {
      treeNode.children.forEach((child) => (child.parent = treeNode));
    }
    treeNode.parent = parent;
    return treeNode;
  }

  /**
   * 新增子原因 (僅限人機料法環測)
   * */
  addNode(node: TreeNode) {
    console.log(node);
    if (!node.children) {
      node.children = [];
    }
    node.children = [
      ...node.children,
      { data: { name: '新原因' }, children: [] },
    ];
    node.expanded = true;
    this.files = [...this.files]; // 觸發 UI 更新
  }

  /**
   * 刪除子原因 (用 UUID 判斷)
   * */
  deleteNode(node: TreeNode) {
    this.dialogConfirmService.confirmDelete(
      () => {
        if (!node.parent) {
          return;
        }
        // 確認後的動作 => 過濾該 givenIndex 的資料
        node.parent.children = node.parent.children!.filter(
          (n) => n.key !== node.key
        );
        this.files = [...this.files]; // 觸發 UI 更新
      },
      '',
      () => {}
    );
  }

  /**
   * 開啟 Dialog 表單
   * @returns DynamicDialogRef
   */
  preview(data?: any): DynamicDialogRef {
    this.dialogOpened = true;

    const ref = this.dialogService.open(DialogFormComponent, {
      header: '魚骨圖',
      width: '100%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        cols: this.cols,
        data: this.files,
      },
      templates: {
        content: FishboneDiagramComponent,
      },
    });
    // Dialog 關閉後要做的事情
    ref?.onClose
      .pipe(takeUntil(this._destroying$))
      .subscribe((returnData: any) => {
        console.log('關閉 Dialog');
        this.dialogOpened = false;
      });
    return ref;
  }

  /**
   * 儲存魚骨圖資料
   */
  save() {
    console.log(this.files);
    const requestData: SaveFishboneDiagramResource =
      this.convertQueriedToRequest(this.problemUuid, this.files);

    this.fishboneService.saveFishbone(requestData).subscribe({
      next: (res) => {
        if (res.code !== '200' && res.code !== '201') {
          this.messageService.error(res.message);
        } else {
          this.messageService.success(res.message);
        }
      },
      error: (error) => {
        this.messageService.error(error);
      },
    });
  }

  /**
   * 將查詢回來的 JSON 結構 (TreeNode[]) 轉換成 SaveFishboneDiagramResource
   */
  convertQueriedToRequest(
    problemUuid: string,
    queriedNodes: any[]
  ): SaveFishboneDiagramResource {
    return {
      problemUuid,
      diagram: queriedNodes.map((node) => this.mapNode(node)),
    };
  }

  private mapNode(node: any): SaveFishboneNode {
    return {
      data: { name: node.data?.name ?? '' },
      children: (node.children || []).map((child: any) => this.mapNode(child)),
    };
  }

  /**
   * 只取魚骨圖的標題 (root name)
   */
  extractTitle(rootNode: any): SaveFishbonTitle {
    return {
      name: rootNode?.data?.name ?? '',
    };
  }
}
