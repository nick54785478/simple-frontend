import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from '../../../shared/models/base-response.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

/**
 * 資料上傳的 Service
 */
@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly baseApiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  /**
   * 資料上傳
   * @param requestData
   */
  upload(requestData: FormData): Observable<BaseResponse> {
    const url = this.baseApiUrl + '/upload';
    // 此處模擬上傳成功訊息，建立一個 Observable <BaseResponse>
    return of({ code: '200', message: '上傳成功' });
    // return this.http.post<BaseResponse>(url, requestData);
  }
}
