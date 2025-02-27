import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimpleFormTableDataModel } from '../models/simple-form-table-query-data.model ';

@Injectable({
  providedIn: 'root',
})
export class SimpleFormTableService {
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
  ): Observable<SimpleFormTableDataModel[]> {
    // const url = this.baseApiUrl + '/settings/query';

    let params = new HttpParams()
      .set('dropdownData', dropdownData ? dropdownData : '')
      .set('inputTextData', inputTextData ? inputTextData : '')
      .set('inputNumberData', inputNumberData ? inputNumberData : '')
      .set('autoCompleteData', autoCompleteData ? autoCompleteData : '')
      .set('calendarData', calendarData ? calendarData : '')
      .set('inputTime', inputTime ? inputTime : '');
    return this.http.get<SimpleFormTableDataModel[]>(
      '/simple-form-table-data.json',
      { params }
    );
    // return this.http.get<SettingQueried[]>(url, { params });
  }
}
