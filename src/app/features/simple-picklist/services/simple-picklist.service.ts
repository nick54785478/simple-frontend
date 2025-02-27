import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SimplePickListDataModel } from '../models/simple-pickList-query-data.model ';
import { Observable, of } from 'rxjs';
import { SimplePickListRequestDataModel } from '../models/simple-pickList-requst-data.model';
import { BaseResponse } from '../../../shared/models/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class SimplePicklistService {
  private readonly baseApiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  /**
   * 查詢屬於該標的的資料
   * @param param 資料參數
   */
  public queryTargetList(param: string): Observable<SimplePickListDataModel[]> {
    let params = new HttpParams().set('param', param ? param : '');
    return this.http.get<SimplePickListDataModel[]>(
      '/pickList-targetList.json',
      { params }
    );
    // return this.http.get<SettingQueried[]>(url, { params });
  }

  /**
   * 查詢不屬於該標的的、剩餘的資料
   * @param param 資料參數
   */
  public querySourceList(param: string): Observable<SimplePickListDataModel[]> {
    let params = new HttpParams().set('param', param ? param : '');
    return this.http.get<SimplePickListDataModel[]>(
      '/pickList-sourceList.json',
      { params }
    );
    // return this.http.get<SettingQueried[]>(url, { params });
  }

  /**
   * 更新資料
   * @param param 資料參數
   */
  public submit(
    requestData: SimplePickListRequestDataModel
  ): Observable<BaseResponse> {
    return of({ code: '200', message: '更新成功' });
    // return this.http.post<BaseResponse>('/pickList-sourceList.json', {
    //   requestData,
    // });
  }
}
