import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseHeaderLineTableCompoent } from '../../../../shared/component/base/base-header-line-table.component';
import { MenuItem } from 'primeng/api';
import { Option } from '../../../../shared/models/option.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { Subject } from 'rxjs/internal/Subject';
import { OptionService } from '../../../../shared/services/option.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { SimpleHeaderLineTableService } from '../../services/simple-header-line-table.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { SimpleLineTableComponent } from './simple-line-table/simple-line-table.component';
import { DialogFormComponent } from '../../../../shared/component/dialog-form/dialog-form.component';
import { DialogConfirmService } from '../../../../core/services/dialog-confirm.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CoreModule } from '../../../../core/core.module';
import { SimpleHeaderTableComponent } from './simple-header-table/simple-header-table.component';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';

@Component({
  selector: 'app-simple-header-line-table',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  providers: [DialogService],
  templateUrl: './simple-header-line-table.component.html',
  styleUrl: './simple-header-line-table.component.scss',
})
export class SimpleHeaderLineTableComponent
  extends BaseHeaderLineTableCompoent
  implements OnInit, OnDestroy
{
  dropdownDataList: Option[] = []; // 下拉式選單資料
  autoCompleteList: Option[] = []; // autoComplete 選單資料
  rowActionMenu: MenuItem[] = []; // Table Row Actions 選單。

  /**
   * 用來取消訂閱
   */
  readonly _destroying$ = new Subject<void>();

  // AutoComplete 與其下拉欄位值變動的 Subject，用來避免前次查詢較慢返回覆蓋後次資料
  private autoCompleteDataSubject$ = new Subject<string>();

  constructor(
    public dialogService: DialogService,
    private optionService: OptionService,
    private simpleHeaderLineTableService: SimpleHeaderLineTableService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
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

    // 初始化 Header Table 配置
    this.headerCols = [
      { field: 'id', header: 'id' },
      { field: 'field1', header: 'header1' },
      { field: 'field2', header: 'header2' },
      { field: 'field3', header: 'header3' },
    ];

    // 初始化 Child Table 配置
    this.lineCols = [
      { field: 'id', header: 'id' },
      { field: 'field1', header: 'header1' },
      { field: 'field2', header: 'header2' },
      { field: 'field3', header: 'header3' },
      { field: 'field4', header: 'header4' },
      { field: 'field5', header: 'header5' },
    ];
  }

  ngOnDestroy(): void {}

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
   * 查詢資料
   * @returns
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
    this.simpleHeaderLineTableService
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
          this.headerTableData = res;
          console.log(this.headerTableData);
        },
        // 發生錯誤的動作
        error: (error) => {
          this.messageService.error(error.message);
        },
      });
  }

  /**
   * 顯示 Stop 詳細資料
   * @param rowData
   */
  showLineTable(event: any) {
    let headerData = event.data;
    console.log(headerData.field4);
    this.lineTableVisibled = true;
    this.lineTableData = headerData.field4;
  }

  /**
   * Table Action 按鈕按下去的時候要把該筆資料記錄下來。
   * @param rowData 點選的資料
   */
  clickRowActionMenu(dialogType: string, rowData: any): void {
    // console.log('clickRowActionMenu rowData = ' + JSON.stringify(rowData));
    this.rowCurrentData = rowData;
    this.selectedHeaderData = rowData;
    console.log(this.rowCurrentData);

    // 開啟 Dialog
    this.openDialog(dialogType, this.rowCurrentData);
  }

  /**
   * 開啟 Dialog 表單
   * @returns DynamicDialogRef
   */
  openDialog(dialogType: string, rowData?: any): DynamicDialogRef {
    this.dialogOpened = true;

    console.log(rowData);

    let config: DialogConfig;
    // 根據 DialogType 設置值
    if (dialogType === 'Header') {
      config = {
        component: SimpleHeaderTableComponent,
        dataAction: 'HEADER_DETAIL',
        header: 'Header 詳細資料',
        data: {
          rowData: rowData,
          lineCols: this.lineCols,
        },
      };
    } else {
      config = {
        component: SimpleLineTableComponent,
        dataAction: 'Line',
        header: 'Line 詳細資料',
        data: {
          uuid: this.selectedHeaderData.uuid,
          fromStop: rowData.stopName,
        },
      };
    }

    const ref = this.dialogService.open(DialogFormComponent, {
      header: config.header,
      width: '85%',
      height: '85%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: config.data,
      templates: {
        content: config.component,
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
}
