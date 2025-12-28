import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FishboneNode } from '../models/fishbone-node.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { BaseResponse } from '../../../shared/models/base-response.model';
import {
  SaveFishboneDiagramResource,
  SaveFishboneNode,
} from '../models/save-fishbone-diagram.model';
import { Option } from '../../../shared/models/option.model';
import { FishboneNodeQueriedResource } from '../models/fishbone-queried.model';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root',
})
export class FishboneService {
  private readonly baseApiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  /**
   * 取得魚骨圖資料
   * @param problemUuid
   * @returns
   */
  getFishbone(problemUuid: string): Observable<FishboneNode[]> {
    const url = this.baseApiUrl + '/rootcuase-analysis/fishbone';
    let params = new HttpParams().set('uuid', problemUuid ? problemUuid : '');
    return this.http.get<FishboneNodeQueriedResource>('/fishbone.json').pipe(
      map((response) => {
        return response?.data;
      })
    );
  }

  /**
   * 儲存 Problem Report 資料
   * @param requestData
   * @returns
   */
  saveFishbone(
    requestData: SaveFishboneDiagramResource
  ): Observable<BaseResponse> {
    return of({ code: '200', message: '儲存成功' });
    // const url = this.baseApiUrl + '/rootcuase-analysis/fishbone';
    // return this.http.post<BaseResponse>(url, requestData);
  }
}
