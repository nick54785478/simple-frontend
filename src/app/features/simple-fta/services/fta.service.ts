import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SaveFtaDiagramResource } from '../models/save-fta-diagram.model';
import { BaseResponse } from '../../../shared/models/base-response.model';
import { Observable } from 'rxjs/internal/Observable';
import { TreeNode } from 'primeng/api';
import { FtaNodeQueriedResource } from '../models/fta-node-queried.mode';
import { map } from 'rxjs/internal/operators/map';
import {
  FtaConfigureQueriedData,
  FtaConfiguresQueriedResource,
} from '../models/fta-configures-queried.mode';
import { Option } from '../../../shared/models/option.model';
import { FtaTopEventOptionQueriedResource } from '../models/fta-top-event-option-queried.mode';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DeleteFtaConfigureResource } from '../models/delete-fta-configure.mode';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FtaService {
  private readonly baseApiUrl = environment.apiEndpoint;

  private topEventsSubject = new BehaviorSubject<any[]>([]);
  topEvents$ = this.topEventsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * 儲存 fta 資料
   * @param requestData
   * @returns
   */
  saveFta(requestData: SaveFtaDiagramResource): Observable<BaseResponse> {
    // const url = this.baseApiUrl + '/rootcuase-analysis/fta';
    // return this.http.post<BaseResponse>(url, requestData);
    return of({ code: '200', message: '儲存成功' });
  }

  /**
   * 取得 Fta 圖表資料
   * @param problemUuid
   * @param ftaUuid
   * @returns
   */
  getFtaDiagram(
    problemUuid: string,
    topEventUuid: string
  ): Observable<TreeNode[]> {
    // const url = this.baseApiUrl + '/rootcuase-analysis/fta';
    // let params = new HttpParams()
    //   .set('problemUuid', problemUuid ? problemUuid : '')
    //   .set('ftaUuid', ftaUuid ? ftaUuid : '');
    return this.http
      .get<FtaNodeQueriedResource>('/fta-' + topEventUuid + '.json')
      .pipe(
        map((response) => {
          return response?.data;
        })
      );
  }

  /**
   * 取得 Fta 圖表配置資料清單
   * @param problemUuid
   * @param topEventUuid
   * @returns
   */
  getFtaConfigureList(
    problemUuid: string,
    topEventUuid: string
  ): Observable<FtaConfigureQueriedData[]> {
    // const url = this.baseApiUrl + '/rootcuase-analysis/fta/configures';
    // let params = new HttpParams().set(
    //   'problemUuid',
    //   problemUuid ? problemUuid : ''
    // );

    console.log(topEventUuid);

    return this.http
      .get<FtaConfiguresQueriedResource>('/fta-' + topEventUuid)
      .pipe(
        map((response) => {
          return response?.data;
        })
      );
  }

  /**
   * 刪除 fta 配置資料
   * @param requestData
   * @returns
   */
  deleteFtaConfigure(requestData: DeleteFtaConfigureResource) {
    const url = this.baseApiUrl + '/rootcuase-analysis/fta/configure';
    return this.http.delete<BaseResponse>(url, {
      body: requestData,
    });
  }

  /**
   * 取得 Top Event 下拉式選單資料
   * @param problemUuid
   */
  getTopEventOptions(problemUuid: string): Observable<Option[]> {
    // const url = this.baseApiUrl + '/rootcuase-analysis/fta/options';
    // let params = new HttpParams().set(
    //   'problemUuid',
    //   problemUuid ? problemUuid : ''
    // );
    return this.http
      .get<FtaTopEventOptionQueriedResource>('/root-event.json')
      .pipe(
        map((response) => {
          return response?.data;
        })
      );
  }
}
