import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { FormField } from '../models/form-field.model ';

@Injectable({
  providedIn: 'root',
})
export class DynamicGeneratingService {
  private readonly baseApiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  /**
   * 取得 UI 資料
   * @returns
   */
  public getUIData(): Observable<FormField[]> {
    return this.http.get<FormField[]>('/dynamic-generating-jsonstring.json');
  }
}
