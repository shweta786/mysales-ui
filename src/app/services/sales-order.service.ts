import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from "rxjs/Subject";
import { SecureHttp } from '../shared/secure-http';
import { environment } from '../../environments/environment';
import { JobsToBeInvoiced } from "../shared/model/jobs-toBeInvoiced.model";
import { ClientService } from "./client.service";

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class SalesOrderService {
    
    jobsToBeInvoicedCountChange= new Subject<number>();
  
    jobsReadyToArchivedChange= new Subject<number>();

    jobsChangedToReadyToInvoice= new Subject<boolean>();

    constructor(private secureHttp: SecureHttp, private clientService: ClientService) { }

    getAllJobsToBeInvoiced(): Observable<JobsToBeInvoiced[]> {
        let url = `${BASE_URL}/finance/READY_TO_INVOICE`;
            return this.secureHttp.get(url)
                .map((res: Response) => res.json())
                .map((json: any) => json.data)
      }

    getAllJobsReadyToArchived(): Observable<JobsToBeInvoiced[]> {
        let url = `${BASE_URL}/finance/READY_TO_ARCHIVE`;
            return this.secureHttp.get(url)
                .map((res: Response) => res.json())
                .map((json: any) => json.data)
    }

    createSalesOrder(salesOrders: any): Observable<boolean> {
        let url = `${BASE_URL}/job/createSalesOrder`;
        return this.secureHttp.post(url, salesOrders)
            .map((res: Response) => res.json())
            .catch((err: any) => {
                console.error('Error in salesOrder service - createSalesOrder');
                return Observable.throw('Error creating sales order');
            });

    }

    createInvoiceReport(salesOrders: any): Observable<boolean> {
        let url = `${BASE_URL}/salesOrder/finance`;
        return this.secureHttp.post(url, salesOrders)
            .map((res: Response) => res.json())
            .catch((err: any) => {
                console.error('Error in salesOrder service - createInvoiceReport');
                return Observable.throw('Error creating invoice report');
            });

    }

    unlockJob(jobs: any): Observable<boolean> {
        let clientId = this.clientService.currentClientId;
        let url = `${BASE_URL}/jobs/status/READY_TO_ARCHIVE`;
        return this.secureHttp.post(url, jobs)
            .map((res: Response) => res.json())
            .catch((err: any) => {
                console.error('Error in salesOrder service - unlockJob');
                return Observable.throw('Error unlocking Job');
            });

    }
    
    jobCostSent(jobs: any): Observable<boolean> {
        let clientId = this.clientService.currentClientId;
        let url = `${BASE_URL}/jobs/status/JOB_COST_SENT`;
        return this.secureHttp.post(url, jobs)
            .map((res: Response) => res.json())
            .catch((err: any) => {
                console.error('Error in salesOrder service - unlockJob');
                return Observable.throw('Error unlocking Job');
            });

    }

    getAllJobsToBeInvoicedCount(): Observable<number> {
        let url = `${BASE_URL}/finance/count/READY_TO_INVOICE`;
        return this.secureHttp.get(url)
            .map((res: Response) => res.json())
            .map((json: any) => json.data);
    }

    getAllJobsReadyToArchivedCount(): Observable<number> {
        let url = `${BASE_URL}/finance/count/READY_TO_ARCHIVE`;
        return this.secureHttp.get(url)
            .map((res: Response) => res.json())
            .map((json: any) => json.data);
    }
}