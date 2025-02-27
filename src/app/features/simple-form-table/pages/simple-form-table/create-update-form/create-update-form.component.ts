import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseFormCompoent } from '../../../../../shared/component/base/base-form.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CoreModule } from '../../../../../core/core.module';
import { SharedModule } from '../../../../../shared/shared.module';
import { SystemMessageService } from '../../../../../core/services/system-message.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-update-form',
  standalone: true,
  imports: [SharedModule, CoreModule],
  providers: [SystemMessageService],
  templateUrl: './create-update-form.component.html',
  styleUrl: './create-update-form.component.scss',
})
export class CreateUpdateFormComponent
  extends BaseFormCompoent
  implements OnInit, OnDestroy
{
  constructor(
    private location: Location,
    private dialogConfig: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private messageService: SystemMessageService
  ) {
    super();
  }

  ngOnInit(): void {
    // 透過 dialogConfig 取得傳遞來的資料
    this.formAction = this.dialogConfig.data['action'];
    console.log(this.formAction);
    // 監聽上一頁切換，關閉 Dialog
    this.location.onUrlChange(() => {
      this.onCloseForm();
    });
  }

  ngOnDestroy(): void {}

  /**
   * 提交資料
   */
  onSubmit() {
    this.messageService.success('提交成功');
    this.onCloseForm();
  }
  /**
   * 關閉 Dialog
   */
  onCloseForm() {
    console.log('關閉 Dialog');
    this.ref.close();
    this.clear();
  }

  clear() {}
}
