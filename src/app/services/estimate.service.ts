import { Injectable } from '@angular/core';
import { Estimate } from '../shared/model/estimate.model';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SecureHttp } from '../shared/secure-http';
import * as _ from 'lodash';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import { JobsToBeInvoiced } from "../shared/model/jobs-toBeInvoiced.model";
import { EstimateVersionList } from '../shared/model/estimate-version-list.model';
import { EstimateSavedPointList } from '../shared/model/estimate-savedpoint-list';
import { EmptyJob } from './../shared/model/empty-job.model';
import { checkMode } from './../../environments/environment'
const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class EstimateService {
  
  constructor(private secureHttp: SecureHttp) {
  }

  getEstimates(clientId: number, status: string): Observable<Estimate[]> {
    let url = `${BASE_URL}/estimates/${clientId}/${status}`;
    return this.secureHttp.get(url)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
      .map(Estimate.fromJsonListForListing);
  }

  getEstimateCount(clientId: number, status: string): Observable<number> {
    let url = `${BASE_URL}/estimates/${clientId}/${status}/count`;
    return this.secureHttp.get(url)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
      .map((data: any) => data.count);
  }

  getById(id: number): Observable<Estimate> {
    let url = `${BASE_URL}/estimate/${id}`;
    return this.secureHttp.get(url)
      .map((res: Response) => {
        let body = res.json();
        return _.isObject(body.data) ? body.data : {};
      })
      .map((json) => Estimate.fromJsonForDetails(json))
      .catch((err: any) => {
        console.error('Error in estimate service - getById');
        console.error(err);
        return Observable.throw('Error getting estimate with id ' + id);
      });
  }

  updateEstimate(estimate: Estimate, saveWithVersion?: boolean): Observable<boolean> {
    let url= `${BASE_URL}/estimate/${estimate.estimateId}/${saveWithVersion}`;
    
   let jsonBody = JSON.stringify(estimate);
    return this.secureHttp.put(url, jsonBody)
      .map((res: Response) => {
        let body = res.json();
        return body.data;
      })
      .catch((err: any) => {
        console.error('Error in estimate service - updateEstimate');
        console.error(err);
        return Observable.throw('Error updating estimate with id ' + estimate.estimateId);
      });

  }

  updateEstimateInfo(estimate: Estimate): Observable<number> {
    let url = `${BASE_URL}/estimate/${estimate.estimateId}`;
    let body = {
      estimateId: estimate.estimateId,
      ptContactId: estimate.ptContactId
    };
    let jsonBody = JSON.stringify(body);
    return this.secureHttp.put(url, jsonBody)
      .map((res: Response) => {
        let responseBody = res.json();
        if (!responseBody.success) {
          throw responseBody.message;
        }
        return responseBody;
      })
      .catch((err: any) => {
        console.error("Error in estimate service - createEstimate");
        console.error(err);
        return Observable.throw("Error creating new estimate");
      })
  }

  createEstimate(estimate: Estimate): Observable<number> {
    let url = `${BASE_URL}/estimate`;
    let body = {
      dateEntered: moment().toISOString(),
      projectName: estimate.projectName,
      projectNumber: estimate.projectNumber,
      entityNumberId: estimate.entityNumberId,
      ptContactId: estimate.ptContactId,
      clientId: estimate.clientId,
      brandId: estimate.brandId,
      contactAttn: "",
      contactEmail: "",
      statusId: estimate.statusId,
      notes: ""
    };
    let jsonBody = JSON.stringify(body);
    return this.secureHttp.post(url, jsonBody)
      .map((res: Response) => {
        let responseBody = res.json();
        if (!responseBody.success) {
          throw responseBody.error;
        }
        return responseBody.data.estimateId;
      })
      .catch((err: any) => {
        console.error("Error in estimate service - createEstimate");
        console.error(err);
        return Observable.throw("Error creating new estimate");
      })
  }

  emailEstimate(estimate: Estimate, semicolonSeparatedEmails: String, notes?: string, showDetails? : boolean): Observable<any> {
    let url = `${BASE_URL}/reports/request/${estimate.estimateId}/${showDetails}/${checkMode.mode}`;
    let jsonBody = JSON.stringify({ toAddresses: semicolonSeparatedEmails, notes:notes });
    return this.secureHttp.post(url, jsonBody).map((res: Response) => {
      let body = res.json();
      return body;
    })
      .catch((err: any) => {
        console.error('Error in estimate service - emailEstimate');
        console.error(err);
        return Observable.throw('Error emailing estimate with id ' + estimate.estimateId);
      });
  }

  getjobsToBeInvoiced(clientId: number): Observable<JobsToBeInvoiced[]> {
    let url = `${BASE_URL}/job/tobeInvoice/${clientId}`;
        return this.secureHttp.get(url)
            .do(console.log)
            .map((res: Response) => res.json())
            .map((json: any) => json.data);
  }

  updateJobLockValue(jobId : number, value : boolean): Observable<boolean>{
    let url = `${BASE_URL}/job/lock/${jobId}/${value}`;
    let values = {jobId : jobId, lockValue : value};
    return this.secureHttp.post(url, JSON.stringify(values))
            .do(console.log)
            .map((res: Response) => res.json());           
  }

  getEstimateByVerson(estimateId : number, verson: number): Observable<Estimate> {
    let url = `${BASE_URL}/estimate/${estimateId}/${verson}`;
    return this.secureHttp.get(url)
      .map((res: Response) => {
        let body = res.json();
        return _.isObject(body.data) ? body.data : {};
      })
      .map((json) => Estimate.fromJsonForDetails(json))      
      .catch((err: any) => {
        console.error('Error in estimate service - getEstimateByVerson');
        console.error(err);
        return Observable.throw('Error getting estimate with estimateId' + estimateId);
      });
  }

  getVersionByEstimate(estimateId : number): Observable<EstimateVersionList[]> {
    let url = `${BASE_URL}/listOfVersions/${estimateId}`;
    return this.secureHttp.get(url)
      .map((res: Response) => {
        let body = res.json();
        return _.isObject(body.data) ? body.data : {};
      })
      .catch((err: any) => {
        console.error('Error in estimate service - getVersionByEstimate');
        console.error(err);
        return Observable.throw('Error getting estimate with estimateId' + estimateId);
      });
  }

  getEstimateBySavedPoint(estimateId : number, savedPoint: number): Observable<Estimate> {
    let url = `${BASE_URL}/estimateSavedPoint/${estimateId}/${savedPoint}`;
    return this.secureHttp.get(url)
      .map((res: Response) => {
        let body = res.json();
        return _.isObject(body.data) ? body.data : {};
      })
      .map((json) => Estimate.fromJsonForDetails(json))      
      .catch((err: any) => {
        console.error('Error in estimate service - getEstimateBySavedPoint');
        console.error(err);
        return Observable.throw('Error getting estimate with estimateId' + estimateId);
      });
  }

  getSavedPointsByEstimate(estimateId : number): Observable<EstimateSavedPointList[]> {
    let url = `${BASE_URL}/listOfSavedPoints/${estimateId}`;
    return this.secureHttp.get(url)
      .map((res: Response) => {
        let body = res.json();
        return _.isObject(body.data) ? body.data : {};
      })
      .catch((err: any) => {
        console.error('Error in estimate service - getSavedPointsByEstimate');
        console.error(err);
        return Observable.throw('Error getting estimate with estimateId' + estimateId);
      });
  }

  getEmptyJobs(clientId: number): Observable<EmptyJob[]> {
    let url = `${BASE_URL}/jobs/${clientId}`;
    return this.secureHttp.get(url)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
      .map(EmptyJob.fromJsonListForListing)
      .map((jobs: EmptyJob[]) => {
          jobs.forEach((job: EmptyJob) => {
            job.dateEntered = new Date(job.dateEntered);
          });
          return jobs;
        });
  }

  getEmptyJobCount(clientId: number, status: string): Observable<number> {
    let url = `${BASE_URL}/jobs/${clientId}/count`;
    return this.secureHttp.get(url)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
      .map((data: any) => data.count);
  }
}
