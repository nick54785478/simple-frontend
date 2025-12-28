import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SystemMessageService } from '../../../core/services/system-message.service';
import { LoadingMaskService } from '../../../core/services/loading-mask.service';

/**
 * 定義基礎的 Form 表單 Component
 */
@Component({
  selector: 'app-base-form-compoent',
  standalone: true,
  imports: [],
  providers: [],
  template: '',
})
export abstract class BaseFormCompoent implements OnInit, OnDestroy {
  protected loadingMaskService = inject(LoadingMaskService);
  protected messageService = inject(SystemMessageService);

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
   * 初始化狀態
   */
  private resetState() {
    this.dialogOpened = false;
    this.formGroup = new FormGroup({});
    this.submitted = false;
  }
}
