import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Option } from '../models/option.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../../environments/environment';
import { AutoCompleteOption } from '../models/autocomplete-option.model';

@Injectable({
  providedIn: 'root',
})
export class OptionService {
  private readonly baseApiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  /**
   * 取得下拉式選單資料
   * @returns
   */
  public getDropDownList(): Observable<Option[]> {
    return this.http.get<Option[]>('/dropdown-list.json').pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * 取得 AutoComplete 資料
   * @param queryStr 查詢字串(用於模糊查詢)
   * @returns
   */
  public getAutoCompleteData(
    queryStr: string
  ): Observable<AutoCompleteOption[]> {
    const url = this.baseApiUrl + '/autocomplete-list.json';
    let params = new HttpParams().set('queryStr', queryStr ? queryStr : '');
    return this.http.get<AutoCompleteOption[]>('/autocomplete-list.json').pipe(
      map((response) => {
        return response;
      })
    );
    // return this.http.get<AutoCompleteOption[]>(url, { params }).pipe(
    //   map((response) => {
    //     return response;
    //   })
    // );
  }

  /**
   * 取得 Data Type 配置資料
   * @return Observable<MenuItem[]
   */
  public getDataTypes(): Observable<Option[]> {
    return this.http.get<Option[]>('/data-type.json').pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * 取得 Setting Type 種類
   * @param type DataType
   * @return  Observable<Option[]>
   */
  public getSettingTypes(type: string): Observable<Option[]> {
    const url = this.baseApiUrl + '/options/query';
    let params = new HttpParams().set('type', type ? type : '');
    return this.http.get<Option[]>(url, { params }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * 取得火車種類的下拉式選單資料
   *
   * @return List<OptionResource>
   */
  public getTrainKinds(): Observable<Option[]> {
    const url = this.baseApiUrl + '/options/trainKinds';
    return this.http.get<Option[]>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * 取得票別的下拉式選單資料
   *
   * @return List<OptionResource>
   */
  public getTicketTypes(): Observable<Option[]> {
    const url = this.baseApiUrl + '/options/ticketTypes';
    return this.http.get<Option[]>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * 取得車次號的下拉式選單資料
   *
   * @return List<OptionResource>
   */
  public getTrainNoList(): Observable<Option[]> {
    const url = this.baseApiUrl + '/options/trainNoList';
    return this.http.get<Option[]>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
