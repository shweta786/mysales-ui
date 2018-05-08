import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { SecureHttp } from '../shared/secure-http';
import { JobDescriptionList } from '../shared/model/job-descriptions.model';
import { environment } from '../../environments/environment';
import { ClientService } from '../services/client.service'

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class EstimateJobService {

  constructor(private http: SecureHttp, private clientService: ClientService) { }

  getJobsByClient(clientId: number, parentEntityNumberId:string): Observable<JobDescriptionList[]> {
    return this.http.get(`${BASE_URL}/projects/${clientId}/${parentEntityNumberId}`)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
      .map((json: any) => JobDescriptionList.fromJsonList(json));
  }
}
