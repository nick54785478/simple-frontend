import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { BaseFormCompoent } from '../../../../shared/component/base/base-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Option } from '../../../../shared/models/option.model';
import { OptionService } from '../../../../shared/services/option.service';
import { SystemMessageService } from '../../../../core/services/system-message.service';
import { LoadingMaskService } from '../../../../core/services/loading-mask.service';
import { DynamicGeneratingService } from '../../services/dynamic-generating.service';
import { first, firstValueFrom, lastValueFrom } from 'rxjs';
import { FormField } from '../../models/form-field.model ';

@Component({
  selector: 'app-dynamic-generating',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [SystemMessageService, LoadingMaskService],
  templateUrl: './dynamic-generating.component.html',
  styleUrl: './dynamic-generating.component.scss',
})
export class DynamicGeneratingComponent
  extends BaseFormCompoent
  implements OnInit
{
  componentName: string = 'DynamicGeneratingComponent';
  filteredSuggestions: string[] = [];
  allSuggestions: Option[] = [];

  // formFields: FormField[] = [];
  formFields: FormField[] = [];

  formData: any = {};

  constructor(
    private fb: FormBuilder,
    private optionService: OptionService,
    private dynamicGeneratingService: DynamicGeneratingService
  ) {
    super();
  }

  override ngOnInit(): void {
    this.initialize();
  }

  /**
   * 初始化資料
   */
  async initialize(): Promise<void> {
    // 初始化
    this.formGroup = new FormGroup({});
    // 透過 API 取得資料
    this.formFields = await firstValueFrom(
      this.dynamicGeneratingService.getUIData()
    );

    if (!this.formFields || this.formFields.length === 0) {
      console.error('Form fields data is empty');
      return;
    }

    const formControls: any = {};
    // 遍歷所有 Field，並初始化 formControl 以及 Validator
    this.formFields.forEach((field) => {
      const validators = field.validators
        ? this.getValidators(field.validators)
        : [];
      formControls[field.name] = ['', validators];
    });

    this.formGroup = this.fb.group(formControls);
  }

  /**
   * 取得 Validators
   * @param validators
   * @returns
   */
  getValidators(validators: string[]) {
    const formValidators = [];
    if (validators.includes('required')) {
      formValidators.push(Validators.required);
    }
    if (validators.includes('email')) {
      formValidators.push(Validators.email);
    }
    if (validators.includes('requiredTrue')) {
      formValidators.push(Validators.requiredTrue);
    }
    return formValidators;
  }

  /**
   * 提交表單資料
   * @returns
   */
  onSubmit() {
    this.submitted = true;
    if (this.formGroup.invalid || !this.submitted) {
      return;
    }
    const formData = this.formGroup.value;
    this.loadingMaskService.show();
    console.log(formData);
    this.messageService.success('提交成功');
    this.loadingMaskService.hide();
  }

  /**
   * AutoComplete 取資料
   * */
  search(event: any, uri: string) {
    console.log(event.query);
    this.optionService.getDynamicAutoCompleteData(event.query, uri).subscribe({
      next: (res) => {
        this.allSuggestions = res.map((item: any) => ({
          id: item.id, // 保留 id
          label: item.label, // 保留 label
          value: item.value, // 保留 value
        }));
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  /**
   * 清除表單資料
   */
  clear() {
    this.formGroup.reset();
  }
}
