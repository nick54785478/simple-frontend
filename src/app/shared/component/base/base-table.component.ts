import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SystemMessageService } from '../../../core/services/system-message.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoadingMaskService } from '../../../core/services/loading-mask.service';
import { MenuItem } from 'primeng/api';

/**
 * 定義基礎的 Table 表格 Component
 */
@Component({
  selector: 'app-base-table-compoent',
  standalone: true,
  imports: [],
  providers: [SystemMessageService, LoadingMaskService],
  template: '',
})
export abstract class BaseTableCompoent {
  protected loadingMaskService = inject(LoadingMaskService);
  protected messageService = inject(SystemMessageService);

  /**
   * 動態定義表格欄位參數
   */
  cols: any[] = [];

  /**
   * 表格資料
   */
  tableData: any[] = [];

  /**
   * 選擇的 row data
   */
  selectedData: any;

  /**
   * 上方頁簽
   * */
  protected detailTabs: MenuItem[] = [];

  /**
   * 用於 Submit 用的 Flag
   */
  protected submitted: boolean = false;

  /**
   * 是否開啟 Dialog
   */
  protected dialogOpened: boolean = false;

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
   * 紀錄該筆資料
   * @param rowData 點選的資料
   */
  clickRowActionMenu(rowData: any): void {
    this.selectedData = rowData;
  }

  /**
   * 初始化狀態
   */
  private resetState() {
    this.dialogOpened = false;
    this.tableData = [];
    this.submitted = false;
    this.detailTabs = [];
  }
}
