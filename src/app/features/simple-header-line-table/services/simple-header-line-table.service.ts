import { Injectable } from '@angular/core';
import { SimpleParentTableDataModel } from '../models/simple-double-table-query-data.model';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SimpleHeaderLineTableService {
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
  ): Observable<SimpleParentTableDataModel[]> {
    // const url = this.baseApiUrl + '/settings/query';

    let params = new HttpParams()
      .set('dropdownData', dropdownData ? dropdownData : '')
      .set('inputTextData', inputTextData ? inputTextData : '')
      .set('inputNumberData', inputNumberData ? inputNumberData : '')
      .set('autoCompleteData', autoCompleteData ? autoCompleteData : '')
      .set('calendarData', calendarData ? calendarData : '')
      .set('inputTime', inputTime ? inputTime : '');
    return this.http.get<SimpleParentTableDataModel[]>(
      '/simple-double-table-data.json',
      { params }
    );
    // return this.http.get<SettingQueried[]>(url, { params });
  }
}
