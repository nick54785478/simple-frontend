import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BaseResponse } from '../../../shared/models/base-response.model';
import { SimpleInlineEditDataModel } from '../pages/models/simple-inline-edit-query-data.model ';
import { SimpleInlineEditRequestData } from '../pages/models/simple-inline-edit-request-data.model';

@Injectable({
  providedIn: 'root',
})
export class SimpleInlineEditService {
  private readonly baseApiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  /**
   * 查詢資料
   */
  public queryData(
    dropdownData: string,
    inputTextData: string,
    inputNumberData: number,
    autoCompleteData: string,
    calendarData: string,
    inputTime: string
  ): Observable<SimpleInlineEditDataModel[]> {
    // const url = this.baseApiUrl + '/settings/query';

    let params = new HttpParams()
      .set('dropdownData', dropdownData ? dropdownData : '')
      .set('inputTextData', inputTextData ? inputTextData : '')
      .set('inputNumberData', inputNumberData ? inputNumberData : '')
      .set('autoCompleteData', autoCompleteData ? autoCompleteData : '')
      .set('calendarData', calendarData ? calendarData : '')
      .set('inputTime', inputTime ? inputTime : '');
    return this.http.get<SimpleInlineEditDataModel[]>(
      'simple-inline-edit-data.json',
      { params }
    );
    // return this.http.get<SettingQueried[]>(url, { params });
  }

  /**
   * 更新資料
   * @param param 資料參數
   */
  public update(
    requestData: SimpleInlineEditRequestData[]
  ): Observable<BaseResponse> {
    return of({ code: '200', message: '更新成功' });
    // return this.http.post<BaseResponse>('/pickList-sourceList.json', {
    //   requestData,
    // });
  }
}
