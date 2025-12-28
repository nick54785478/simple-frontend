import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { BaseInlineEditTableCompoent } from '../../../../shared/component/base/base-inline-edit-table.component';
import { MenuItem } from 'primeng/api';
import { Option } from '../../../../shared/models/option.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { OptionService } from '../../../../shared/services/option.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { SystemMessageService } from '../../../../core/services/system-message.service';
import { SimpleInlineEditService } from '../../services/simple-inline-edit.service';
import { LoadingMaskService } from '../../../../core/services/loading-mask.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { DialogConfirmService } from '../../../../core/services/dialog-confirm.service';
import { SimpleInlineEditRequestData } from '../../models/simple-inline-edit-request-data.model';

@Component({
  selector: 'app-simple-inline-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [SystemMessageService, LoadingMaskService, DialogConfirmService],
  templateUrl: './simple-inline-edit.component.html',
  styleUrl: './simple-inline-edit.component.scss',
})
export class SimpleInlineEditComponent
  extends BaseInlineEditTableCompoent
  implements OnInit, DoCheck, OnDestroy
{
  dropdownDataList: Option[] = []; // 下拉式選單資料
  autoCompleteList: Option[] = []; // autoComplete 選單資料
  rowActionMenu: MenuItem[] = []; // Table Row Actions 選單。
  rowCurrentData: any; // 現在選取的那一筆
  readonly _destroying$ = new Subject<void>(); // 用來取消訂閱
  // AutoComplete 與其下拉欄位值變動的 Subject，用來避免前次查詢較慢返回覆蓋後次資料
  private autoCompleteDataSubject$ = new Subject<string>();

  constructor(
    private optionService: OptionService,
    private dialogConfirmService: DialogConfirmService,
    private simpleInlineEditService: SimpleInlineEditService
  ) {
    super();
  }
  ngDoCheck(): void {
    this.detailTabs = [
      {
        label: '新增',
        icon: 'pi pi-plus',
        // 當沒有表單資料，不能新增
        disabled:
          !(this.mode === '') ||
          (!this.formGroup.invalid && this.tableData.length === 0),
        command: () => {
          this.addNewRow();
        },
      },
      {
        label: '提交',
        icon: 'pi pi-save',
        command: () => {
          this.submit();
        },
        // 當在新增或編輯模式時，不能提交
        disabled:
          this.tableData.length === 0 ||
          this.mode === 'add' ||
          this.mode === 'edit',
      },
      {
        label: '放棄',
        icon: 'pi pi-times',
        command: () => {
          this.cancelAll();
        },
        disabled: this.tableData.length === 0,
      },
    ];
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
      {
        field: 'field1',
        header: 'header1',
        width: '10rem',

        type: 'inputText',
        data: '',
      },
      {
        field: 'field2',
        header: 'header2',
        type: 'autoComplete',
        width: '10rem',
        data: '',
      },
      {
        field: 'field3',
        header: 'header3',
        type: 'dropdown',
        width: '10rem',
        data: 'dropdownDataList',
      },
      {
        field: 'field4',
        header: 'header4',
        type: 'inputNumber',
        width: '10rem',
        data: '',
      },
      {
        field: 'field5',
        header: 'header5',
        type: 'textArea',
        width: '10rem',
        data: '',
      },
      {
        field: 'field6',
        header: 'header6',
        type: 'inputTime',
        width: '10rem',
        data: '',
      },
    ];

    this.detailTabs = [
      {
        label: '新增',
        icon: 'pi pi-plus',
        // 當沒有表單資料，不能新增
        disabled:
          !(this.mode === '') ||
          (!this.formGroup.value.trainNo && this.tableData.length === 0),
        command: () => {
          this.addNewRow();
        },
      },
      {
        label: '提交',
        icon: 'pi pi-save',
        command: () => {
          //  this.submit();
        },
        // 當在新增或編輯模式時，不能提交
        disabled:
          this.tableData.length === 0 ||
          this.mode === 'add' ||
          this.mode === 'edit',
      },
      {
        label: '放棄',
        icon: 'pi pi-times',
        command: () => {
          this.cancelAll();
        },
        disabled: this.tableData.length === 0,
      },
    ];
  }

  override ngOnDestroy(): void {}

  /**
   * 新增一筆空的 row 資料
   * */
  addNewRow(): void {
    this.mode = 'add';
    this.newRow = {
      id: null,
      field1: '',
      field2: '',
      field3: '',
      field4: '',
      field5: '',
      field6: '',
      givenIndex: this.minGivenIndex--, // 前端給予的編號資料
    };
    this.tableData.unshift(this.newRow);
    // this.onEdit(this.newRow);
    // 觸發該 row 的編輯模式
    setTimeout(() => {
      this.dataTable.initRowEdit(this.newRow);
    });
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

    console.log(this.mode);
    // 呼叫 Service 執行查詢動作
    this.simpleInlineEditService
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
          this.mode = '';

          // 對所有資料進行編號
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].givenIndex = i;
          }
        },
        // 發生錯誤的動作
        error: (error) => {
          this.messageService.error(error.message);
        },
      });
  }

  /**
   * Table Action 按鈕按下去的時候要把該筆資料記錄下來。
   * @param rowData 點選的資料
   */
  clickRowActionMenu(rowData: any): void {
    this.selectedData = rowData;
  }

  /**
   * 取消編輯/新增
   * */
  cancel(rowData: any, rowIndex: number) {
    console.log(rowIndex);
    this.tableData[rowIndex] = this.clonedData[rowData.givenIndex];
    delete this.clonedData[rowData.givenIndex];
  }

  /**
   * 取消編輯
   */
  cancelEdit() {
    if (!this.editingRow) {
      return;
    }

    console.log(this.editingRow.givenIndex);
    // 透過 editingRow 回覆上次修改的資料
    this.tableData.forEach((e) => {
      if (
        e.id === this.editingRow.id &&
        e.givenIndex === this.editingRow.givenIndex
      ) {
        e.field1 = this.editingRow.field1;
        e.field2 = this.editingRow.field2;
        e.field3 = this.editingRow.field3;
        e.field4 = this.editingRow.field4;
        e.field5 = this.editingRow.field5;
        e.field6 = this.editingRow.field6;
      }
    });

    // 取消，解除模式
    this.mode = '';
  }

  /**
   * 確認編輯/新增
   * @param givenIndex 當前 row 的 givenIndex
   * */
  confirm(rowData: any) {
    if (!this.checkRequired(rowData)) {
      // 觸發該 row 的編輯模式
      setTimeout(() => {
        this.dataTable.initRowEdit(rowData);
      });
    } else {
      this.mode = '';
    }
  }

  /**
   * 刪除 Table 資料
   * @param rowData
   */
  protected override remove(rowData: any): void {
    this.dialogConfirmService.confirmDelete(
      () => {
        // 確認後的動作 => 過濾該 givenIndex 的資料
        this.tableData = this.tableData.filter(
          (item) => item.givenIndex !== rowData.givenIndex
        );
      },
      '',
      () => {}
    );
  }

  /**
   * 切換 編輯模式
   * @param givenIndex
   * @returns
   */
  onEdit(rowData: any) {
    console.log(rowData);
    this.clonedData[rowData.givenIndex] = { ...rowData };
  }
  /**
   * 回歸原狀，原先新增的資料全部放棄。
   */
  cancelAll() {
    // 若在編輯模式中取消，呼叫 cancelEdit 方法
    if (this.mode === 'edit') {
      this.cancelEdit();
    }
    this.mode = '';
    this.newRow = '';
    this.newRowIndexes = [];
    this.selectedData = null;
    this.selectedIndex = -1;
    this.editingIndex = -1;
    this.editingRow = [];
    this.tableData = this.tableData.filter((data) => data.id !== null);
  }

  /**
   * 在編輯模式載入下拉式選單資料
   * @param col
   * @returns
   */
  override loadDropdownData(col: any) {
    if (col.field === 'field2') {
      return this.autoCompleteList;
    } else if (col.field === 'field3') {
      return this.dropdownDataList;
    }
    return [];
  }

  /**
   * 清除表單資料
   */
  override clear() {
    this.formGroup.reset();
    this.tableData = [];
    this.selectedIndex = -1;
    this.selectedData = null;
    this.editingIndex = -1;
    this.editingRow = null;
    this.mode = '';
  }

  override submit() {
    this.submitted = true;

    const requestData: SimpleInlineEditRequestData[] = this.tableData.map(
      (data) => {
        return {
          id: data.id,
          field1: data.field1,
          field2: data.field2,
          field3: data.field3,
          field4: data.field4,
          field5: data.field5,
          field6: data.field6,
        };
      }
    );
    this.loadingMaskService.show();
    this.simpleInlineEditService
      .update(requestData)
      .pipe(
        finalize(() => {
          this.loadingMaskService.hide();
          this.submitted = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.messageService.success(res.message);
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
}
