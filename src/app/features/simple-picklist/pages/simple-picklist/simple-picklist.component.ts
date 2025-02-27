import { Component, OnInit } from '@angular/core';
import { BasePickListCompoent } from '../../../../shared/component/base/base-pickList.component';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { OptionService } from '../../../../shared/services/option.service';
import { AutoCompleteOption } from '../../../../shared/models/autocomplete-option.model';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { CommonModule, Location } from '@angular/common';
import { LoadingMaskService } from '../../../../core/services/loading-mask.service';
import { SystemMessageService } from '../../../../core/services/system-message.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SimplePicklistService } from '../../services/simple-picklist.service';
import { finalize } from 'rxjs';
import { error } from 'console';
import { SimplePickListRequestDataModel } from '../../models/simple-pickList-requst-data.model';

@Component({
  selector: 'app-simple-picklist',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule], // 將 ShareModule import
  providers: [
    DialogService,
    DynamicDialogRef,
    DynamicDialogConfig,
    OptionService,
    SystemMessageService,
  ],
  templateUrl: './simple-picklist.component.html',
  styleUrl: './simple-picklist.component.scss',
})
export class SimplePicklistComponent
  extends BasePickListCompoent
  implements OnInit
{
  dialogOpened!: boolean; // 是否開啟 Dialog
  suggestions: AutoCompleteOption[] = [];
  // AutoComplete 與其下拉欄位值變動的 Subject，用來避免前次查詢較慢返回覆蓋後次資料
  private autoCompleteDataSubject$ = new Subject<string>();
  private readonly _destroying$ = new Subject<void>(); // 用來取消訂閱

  constructor(
    private optionService: OptionService,
    private location: Location,
    private loadingMaskService: LoadingMaskService,
    private messageService: SystemMessageService,
    private simplePicklistService: SimplePicklistService,
    private dynamicDialogRef: DynamicDialogRef,
    public dialogService: DialogService
  ) {
    super();
  }
  ngOnInit(): void {
    // 監聽上一頁切換，關閉 Dialog
    this.location.onUrlChange(() => {
      this.closeFormDialog();
    });

    // 初始化 FormGroup
    this.formGroup = new FormGroup({
      autoCompleteData: new FormControl('', [Validators.required]),
    });
    // 初始化上方 Tab 按鈕
    this.detailTabs = [
      {
        label: '提交',
        icon: 'pi pi-save',
        command: () => {
          this.submit();
        },
      },
      {
        label: '放棄',
        icon: 'pi pi-times',
        command: () => {
          this.discard();
        },
      },
    ];
  }
  /**
   * 取得 AutoComplete 資料
   * @param event
   */
  getAutoComplete(event: any) {
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
          this.suggestions = res.map((item: any) => ({
            id: item.id, // 保留 id
            label: item.label, // 保留 label
            value: item.value, // 保留 value
          }));
        });
    }
    this.autoCompleteDataSubject$.next(event.query);
  }

  /**
   * 提交資料變更
   */
  submit() {
    this.submitted = true;
    let formData = this.formGroup.value;
    const requestData: SimplePickListRequestDataModel = {
      param: formData.autoCompleteData,
      dataList: this.sourceList,
    };
    this.loadingMaskService.show();
    this.simplePicklistService
      .submit(requestData)
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

  /**
   * 取消
   */
  discard() {
    this.showPickList = false;
    this.sourceList = [];
    this.targetList = [];
  }

  /**
   * 進行查詢動作
   */
  query() {
    this.submitted = true;
    if (!this.submitted || this.formGroup.invalid) {
      return;
    }
    this.showPickList = true;
    this.queryTargetList();
    this.querySourceList();

    this.submitted = false;
  }

  /**
   *  查詢屬於該標的的資料
   */
  queryTargetList() {
    let formData = this.formGroup.value;
    this.loadingMaskService.show();
    this.simplePicklistService
      .queryTargetList(formData.autoCompleteData)
      .pipe(
        finalize(() => {
          this.loadingMaskService.hide();
          this.submitted = false;
        })
      )
      .pipe(
        finalize(() => {
          // 關閉轉圈圈
          this.loadingMaskService.hide();
        })
      )
      .subscribe({
        next: (res) => {
          this.targetList = res;
          this.messageService.success('查詢成功');
        },
        error: (error) => {
          this.messageService.error(error.message);
        },
      });
  }

  /**
   *  查詢不屬於該標的的、剩餘的資料
   */
  querySourceList() {
    let formData = this.formGroup.value;
    this.loadingMaskService.show();
    this.simplePicklistService
      .querySourceList(formData.autoCompleteData)
      .pipe(
        finalize(() => {
          this.loadingMaskService.hide();
          this.submitted = false;
        })
      )
      .pipe(
        finalize(() => {
          // 關閉轉圈圈
          this.loadingMaskService.hide();
        })
      )
      .subscribe({
        next: (res) => {
          this.sourceList = res;
          this.messageService.success('查詢成功');
        },
        error: (error) => {
          this.messageService.error(error.message);
        },
      });
  }

  /**
   * 清除表單及表格資料
   */
  clear() {
    this.formGroup.reset();
    this.showPickList = false;
    this.sourceList = [];
    this.targetList = [];
  }

  /**
   * 關閉 Dialog 表單
   */
  closeFormDialog() {
    this.dialogOpened = false;
    this.dynamicDialogRef.close();
  }
}
