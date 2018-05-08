import * as moment from 'moment';
import {EstimateJobLineItem} from "./estimate-job-line-item.model";

export class EstimateJob {

  static get empty(): EstimateJob { return new EstimateJob(0,'','','','', false,'','',-1,false, '','',''); }
  public lineItems: EstimateJobLineItem[];

  static fromJson(json: any): EstimateJob {
    let newJob = new EstimateJob(json.jobId, json.jobNumber, json.description,
                                json.readyToInvoiceDate === null ? null : moment(json.readyToInvoiceDate).toISOString(),
                                json.invoiced === null ? null : moment(json.invoiced).toISOString(), 
                                 json.lock,json.entityNumberId,json.jobStatus, json.billingCustomerId,json.billOnly,json.invoiceNumber,
                                  json.orderCreatedDate,json.notes);
    newJob.lineItems = EstimateJobLineItem.fromJsonList(json.lineItems);
    return newJob;
  }
  static fromJsonList(array): EstimateJob[] {
    return array.map(EstimateJob.fromJson);
  }

  constructor(public jobId: number, public jobNumber: string, public description: string,
              public readyToInvoiceDate: string, public invoiced: string, public lock : boolean,
              public entityNumberId: string, public jobStatus: string ,
              public billingCustomerId:number, public billOnly:boolean,public invoiceNumber:string,public orderCreatedDate,public notes:string) {
    this.lineItems = [];
  }
}
