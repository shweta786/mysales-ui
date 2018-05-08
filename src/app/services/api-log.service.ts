import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { SecureHttp } from '../shared/secure-http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { APILogs } from '../shared/model/apiLogs.model';

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class APILogService {

    constructor(private secureHttp: SecureHttp) { }

    //fetching all apiLogs of given date
    getAPILog(logDate): Observable<APILogs[]> {
        return this.secureHttp.get(`${BASE_URL}/apiLogs/${logDate}`)
            .map((res: Response) => res.json())
            .map((json: any) => json.data)
            .map(APILogs.fromJsonList);
    }

    //giving new request for different response
    putAPILog(apiLogId:number, APILogsObject): any {
        let jsonBody = JSON.stringify(APILogsObject);
        return this.secureHttp.put(`${BASE_URL}/apiLog/${apiLogId}`,jsonBody)
        .map((res: Response) => res.json());
    }
}