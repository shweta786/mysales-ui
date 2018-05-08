import { Injectable } from '@angular/core';
import { SecureHttp } from '../shared/secure-http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Estimate } from '../shared/model/estimate.model';
import { Client } from '../shared/model/client.model';


const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class BillingNumberService {

  constructor(private secureHttp: SecureHttp) { }

  getNewBillingNumberForProject(client: Client,billingCustomerId: number, desc: string): Observable<string> {

    let body = {
      customerId:client.id,
      billingCustomerId:billingCustomerId,
      description: desc,
      intacctCustomerName: client.name,
    };
    let jsonBody = JSON.stringify(body);

    let url = `${BASE_URL}/billingnumber/project`;
    return this.secureHttp.post(url,jsonBody)
      .map((res: Response) => {
        let responseBody = res.json();
        if (!responseBody.success) {
          throw responseBody.error;
        }
        return responseBody.data;
      })
      .catch((err: any) => {
        console.error('Error in billing number service - getNewBillingNumberForProject');
        console.error(err);
        return Observable.throw('Error getting new billing number for client for project');
      });
  }

  getNewBillingNumberForJob(client: Client, desc: string,parentEntityNumberId:string, 
    billingCustomerId:number, billOnly:boolean): Observable<string> {
    let url = `${BASE_URL}/billingnumber/job`;
    let body = {
      customerId:client.id,
      billingCustomerId:billingCustomerId,
      description: desc,
      intacctCustomerName: client.name,
      parentEntityNumberId: parentEntityNumberId,
      billOnly: billOnly
    };
    let jsonBody = JSON.stringify(body);


    return this.secureHttp.post(url,jsonBody)
      .map((res: Response) => {
        let responseBody = res.json();
        if (!responseBody.success) {
          throw responseBody.error;
        }
        return responseBody.data;
      })
     .catch((err: any) => {
        console.error('Error in billing number service - getNewBillingNumberForJob');
        console.error(err);
        return Observable.throw('Error getting new billing number for client  for job');
      });
  }
}
