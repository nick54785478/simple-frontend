import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseFormTableCompoent } from '../../../../shared/component/base/base-form-table.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { Option } from '../../../../shared/models/option.model';
import { OptionService } from '../../../../shared/services/option.service';
import { SimpleFormTableService } from '../../services/simple-form-table.service';
import {
  debounceTime,
  finalize,
  lastValueFrom,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { MenuItem } from 'primeng/api';
import { CreateUpdateFormComponent } from './create-update-form/create-update-form.component';
import { FormAction } from '../../../../core/enums/form-action.enum';
import { DialogConfirmService } from '../../../../core/services/dialog-confirm.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { SystemMessageService } from '../../../../core/services/system-message.service';
import { DialogFormComponent } from '../../../../shared/component/dialog-form/dialog-form.component';
import { LoadingMaskService } from '../../../../core/services/loading-mask.service';

@Component({
  selector: 'app-simple-form-table',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [
    DialogService,
    DialogConfirmService,
    DynamicDialogConfig,
    SystemMessageService,
    OptionService,
    DynamicDialogRef,
  ],
  templateUrl: './simple-form-table.component.html',
  styleUrl: './simple-form-table.component.scss',
})
export class SimpleFormTableComponent
  extends BaseFormTableCompoent
  implements OnInit, OnDestroy
{
  dropdownDataList: Option[] = []; // 下拉式選單資料
  autoCompleteList: Option[] = []; // autoComplete 選單資料

  /**
   * 用來取消訂閱
   */
  readonly _destroying$ = new Subject<void>();

  // AutoComplete 與其下拉欄位值變動的 Subject，用來避免前次查詢較慢返回覆蓋後次資料
  private autoCompleteDataSubject$ = new Subject<string>();

  constructor(
    private dialogConfirmService: DialogConfirmService,
    private dynamicDialogRef: DynamicDialogRef,
    public dialogService: DialogService,
    private optionService: OptionService,
    private simpleFormTableService: SimpleFormTableService
  ) {
    super();
  }
  override async ngOnInit(): Promise<void> {
    // 初始化表單
    this.formGroup = new FormGroup({
      dropdownData: new FormControl('', [Validators.required]), // 下拉式選單
      inputTextData: new FormControl('', [Validators.required]), // InputText
      inputNumberData: new FormControl('', [Validators.required]), // InputNumber
      autoCompleteData: new FormControl('', [Validators.required]), // AutoComplete
      calendarData: new FormControl('', [Validators.required]), // calendar
      inputTime: new FormControl('', [Validators.required]), // inputTime
    });

    // 取得下拉式選單資料
    this.dropdownDataList = await lastValueFrom(
      this.optionService.getDropDownList()
    );

    // 初始化 Table 配置
    this.cols = [
      { field: 'field1', header: 'header1' },
      { field: 'field2', header: 'header2' },
      { field: 'field3', header: 'header3' },
      { field: 'field4', header: 'header4' },
      { field: 'field5', header: 'header5' },
      { field: 'field6', header: 'header6' },
    ];
  }

  override ngOnDestroy(): void {
    this.autoCompleteDataSubject$.unsubscribe;
    // 保證組件銷毀時關閉 Dialog
    if (this.dynamicDialogRef) {
      this.dynamicDialogRef.close();
    }
  }

  /**
   * AutoComplete 取資料方法
   */
  completeMethod(event: any) {
    if (!this.autoCompleteDataSubject$.observed) {
      // 初始化 AutoComplete 的訂閱
      this.autoCompleteDataSubject$
        .pipe(
          debounceTime(300), // 防抖，避免頻繁發請求
          switchMap((keyword) => {
            return this.optionService.getAutoCompleteData(keyword);
          }), // 自動取消上一次未完成的請求
          takeUntil(this._destroying$)
        )
        .subscribe((res) => {
          this.autoCompleteList = res.map((item: any) => ({
            id: item.id,
            label: item.label,
            value: item.value,
          }));
        });
    }
    this.autoCompleteDataSubject$.next(event.query);
  }

  /**
   * 查詢動作
   */
  query() {
    this.submitted = true;
    if (!this.submitted || this.formGroup.invalid) {
      return;
    }
    // 開啟轉圈圈
    this.loadingMaskService.show();

    // 取得 Form 表單資料
    let formData = this.formGroup.value;

    console.log(formData);
    // 呼叫 Service 執行查詢動作
    this.simpleFormTableService
      .queryData(
        formData.dropdownData,
        formData.inputTextData,
        formData.inputNumberData,
        formData.autoCompleteData,
        formData.calendarData,
        formData.inputTime
      )
      .pipe(
        finalize(() => {
          // 關閉轉圈圈
          this.loadingMaskService.hide();
        })
      )
      .subscribe({
        // 成功後的動作
        next: (res) => {
          this.messageService.success('查詢成功');
          this.tableData = res;
          console.log(this.tableData);
        },
        // 發生錯誤的動作
        error: (error) => {
          this.messageService.error(error.message);
        },
      });
  }
  /**
   * 清除表單資料
   */
  clear() {
    this.formGroup.reset();
  }

  /**
   * 刪除資料
   * @param id
   */
  delete(id: number) {
    this.dialogConfirmService.confirmDelete(() => {
      // 確認後的動作
      this.messageService.success('刪除成功');
      // 再查一次
      this.query();
    });
  }

  /**
   * 開啟 Dialog 表單
   * @returns DynamicDialogRef
   */
  openFormDialog(formAction?: FormAction, data?: any): DynamicDialogRef {
    this.dialogOpened = true;

    const ref = this.dialogService.open(DialogFormComponent, {
      header: formAction === FormAction.ADD ? '新增一筆資料' : '更新一筆資料',
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        action: formAction,
        data: data,
      },
      templates: {
        content: CreateUpdateFormComponent,
      },
    });
    // Dialog 關閉後要做的事情
    ref?.onClose
      .pipe(takeUntil(this._destroying$))
      .subscribe((returnData: any) => {
        console.log('關閉 Dialog');
        this.dialogOpened = false;
        // this.query();
      });
    return ref;
  }

  /**
   * Table Action 按鈕按下去的時候要把該筆資料記錄下來。
   * @param rowData 點選的資料
   */
  override clickRowActionMenu(rowData: any): void {
    // console.log('clickRowActionMenu rowData = ' + JSON.stringify(rowData));
    this.rowCurrentData = rowData;
    console.log(this.rowCurrentData);

    // 開啟 Dialog
    this.openFormDialog(FormAction.EDIT, this.rowCurrentData);
  }

  /**
   * 新增一筆設定資料表單
   */
  onAdd() {
    this.openFormDialog(FormAction.ADD);
  }

  /**
   * 編輯一筆設定資料
   */
  onEdit() {
    this.openFormDialog(FormAction.EDIT, this.rowCurrentData);
  }
}
