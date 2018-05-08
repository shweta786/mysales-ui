import { Injectable } from '@angular/core';
import { SecureHttp } from '../shared/secure-http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { EstimateStatus } from '../shared/model/estimate-status.model';
import { environment } from '../../environments/environment';

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class EstimateStatusService {

  constructor(private http: SecureHttp) { }

  getEstimateStatuses(): Observable<EstimateStatus[]> {
    if ( environment.estimateStatus.length > 0) {
      return Observable.of(environment.estimateStatus)
            .map(EstimateStatus.fromJsonList);
    } else {

     return this.http.get(`${BASE_URL}/statuses`)
     .map((res: Response) => res.json())
     .map((json: any) => {
      environment.estimateStatus.splice(0,environment.estimateStatus.length);
      environment.estimateStatus.push(...json.data);
       return environment.estimateStatus;
    })
     .map(EstimateStatus.fromJsonList);
    }
  }
}
