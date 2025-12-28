import { Component, OnInit } from '@angular/core';
import { BaseUploadCompoent } from '../../../../shared/component/base/base-upload.component';
import { ExcelData } from '../../../../shared/models/excel-data.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { SharedModule } from '../../../../shared/shared.module';
import { SystemMessageService } from '../../../../core/services/system-message.service';
import { LoadingMaskService } from '../../../../core/services/loading-mask.service';
import { UploadService } from '../../services/upload.service';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-simple-upload',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [SystemMessageService, LoadingMaskService],
  templateUrl: './simple-upload.component.html',
  styleUrl: './simple-upload.component.scss',
})
export class SimpleUploadComponent
  extends BaseUploadCompoent
  implements OnInit
{
  spreadsheet: any;
  templates: any[] = [];

  override sheetNameOptions: any[] = [];

  constructor(private uploadService: UploadService) {
    super();
  }

  override ngOnInit(): void {
    // 上方查詢用表單
    this.formGroup = new FormGroup({
      fileName: new FormControl('', [Validators.required]),
      sheetName: new FormControl('', [Validators.required]),
    });
  }

  /**
   * 資料上傳
   */
  upload() {
    // 此處模擬資料上傳
    this.submitted = true;
    if (!this.submitted || !this.workbook) {
      return;
    }

    console.log('workbook = ' + JSON.stringify(this.workbook));
    // 轉成 Blob
    const excelBuffer: any = XLSX.write(this.workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // 轉成 File
    const file = new File([blob], 'data.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    //開啟轉圈圈
    this.loadingMaskService.show();

    // 此處模擬組裝 Request Data
    const requestData = new FormData();
    requestData.append('file', file);
    requestData.append('data', 'data');

    this.uploadService
      .upload(requestData)
      .pipe(
        finalize(() => {
          // 無論失敗與否都會執行的動作
          this.loadingMaskService.hide(); // 關閉 轉圈圈
          this.submitted = false; // submit 結束
        })
      )
      .subscribe({
        next: (res) => {
          if (res.code === 'VALIDATE_FAILED' && res.message) {
            this.messageService.error(res.message);
          } else {
            this.messageService.success(res.message);
          }
        },
        error: (error) => {
          this.messageService.error(error.message);
        },
      });
  }

  override afterFileParseSuccess(result: ExcelData): void {
    // 設定 sheetname 下拉選單
    this.sheetNameOptions = result.sheetNameOptions;

    this.formGroup.patchValue({
      fileName: result.fileName,
      sheetName: result.sheetNameOptions[0].value,
    });
  }
  override afterFileParseFail(): void {
    this.sheetNameOptions = [];
    this.formControl('fileName').reset();
    this.formControl('sheetName').reset();
  }

  /**
   * 處理上傳檔案的解析
   * @param event
   * @param fileNameFormControlName
   * @returns
   */
  override fileUploadHandler(
    event: any,
    fileNameFormControlName: string
  ): void {
    // 清除檔案預覽
    this.destroyJExcel();

    // 先清除畫面上的訊息，避免錯誤重複或被前一個訊息誤導
    this.messageService.clear();

    this.selectedFile = event.files[0] as File;
    // 檢查檔案大小是否超過上限
    this.fileSizeInvalid = this.excelFileReaderService.fileSizeInvalid(
      this.selectedFile,
      this.maxFileSize
    );
    if (this.fileSizeInvalid) {
      // 如果檔案太大，把檔案名稱寫回欄位，為了消掉必填的驗證
      this.formControl(fileNameFormControlName).patchValue(
        this.selectedFile.name
      );
      // sheetNameOptions = [];
      this.formControl(fileNameFormControlName).markAsDirty();
      // 清除檔案選取元件內容，不然不能重選檔案
      this.fileUploadComponent.clear();
      return;
    }

    this.loadingMaskService.show();
    // 讀取檔案內容
    this.excelFileReaderService
      .parseFile(this.selectedFile)
      .then((result) => {
        this.afterFileParseSuccess(result);
        // 把解析後的 XLSX workBook 資料放到全域變數，預覽會用到
        this.workbook = result.workBook;
        this.loadingMaskService.hide();
      })
      .catch((error) => {
        // Handle the error
        this.afterFileParseFail();
        this.messageService.error(error);
      })
      .finally(() => {
        // 清除檔案選取元件內容，不然不能重選檔案
        this.fileUploadComponent.clear();
        this.loadingMaskService.hide();
      });
  }
}
