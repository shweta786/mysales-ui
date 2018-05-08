import * as moment from 'moment';
import * as _ from "lodash";
import { EstimateJob } from "../model/estimate-job.model";
import { EstimateJobLineItem } from "../model/estimate-job-line-item.model";
import { PriceSheet } from "../model/price-sheet";
import { EstimateCustomLineItem } from "../model/estimate-custom-line-item.model";

export class EstimateLineItemJobViewModel {
  public jobId: number;
  public jobNumber: string;
  public description: string;
  public jobLineItemId: number;
  public lineItemId: number;
  public quantity: number;
  public unitPrice: number;
  public discountPercent: number;
  public discountAmount: number;
  public rushPercent: number;
  public rushAmount: number;
  public discountable: boolean;
  public rushable: boolean;
  public readyToInvoiceDate: string;
  public invoiced: string;
  public projectNumber: string;
  public lock: boolean;
  public entityNumberId: string;
  public jobStatus: string;
  public billingCustomerId: number;
  public billOnly: boolean
  public orderCreatedDate: string;
  public invoiceNumber:string;
  public readyToInvoiceChecked : boolean;

  get ready(): boolean {
    return this.readyToInvoiceDate !== '' && this.readyToInvoiceDate !== null;
  }

  get isInvoiced(): boolean {

  // ((entitynumber.project status of 6. Ready to Invoice AND Estimator.dbo.job.salesOrderCreatedDate is not null) OR entitynumber.project status= 7. Closed)
      return this.jobStatus === '7. Closed' 
        ||  (this.jobStatus === '6. Ready to Invoice' 
              && (this.orderCreatedDate !== '' && this.orderCreatedDate !== null));
  }

  get isDummyJob(): boolean {
    return this.projectNumber === this.jobNumber || this.jobNumber === "" || this.jobNumber === null;
  }

  constructor(estimateJob: EstimateJob, estimateJobLineItem: EstimateJobLineItem, projectNumber: string,
    priceSheet: PriceSheet, customLineItem: EstimateCustomLineItem) {
    this.jobId = estimateJob.jobId;
    this.jobNumber = estimateJob.jobNumber;
    this.invoiceNumber =  estimateJob.invoiceNumber;
    this.projectNumber = projectNumber;
    this.description = estimateJob.description;
    this.jobLineItemId = estimateJobLineItem.jobLineItemId;
    this.lineItemId = estimateJobLineItem.lineItemId;
    this.quantity = estimateJobLineItem.quantity;
    this.unitPrice = priceSheet !== null ? priceSheet.unitPrice : customLineItem !== null ? customLineItem.unitPrice : 0;
    this.rushable = priceSheet !== null ? priceSheet.rushable : false;
    this.discountable = priceSheet !== null ? priceSheet.discountable : false;
    this.discountAmount = this.discountable && this.quantity > 0 ? estimateJobLineItem.discountAmount : 0;
    this.rushAmount = this.rushable && this.quantity > 0 ? estimateJobLineItem.rushAmount : 0;
    this.readyToInvoiceDate = estimateJob.readyToInvoiceDate !== null ? moment(estimateJob.readyToInvoiceDate).format("MM/DD/YYYY") : "";
    this.invoiced = estimateJob.invoiced !== null ? moment(estimateJob.invoiced).format("MM/DD/YYYY") : "";
    this.lock = estimateJob.lock;
    this.entityNumberId = estimateJob.entityNumberId;
    this.jobStatus = estimateJob.jobStatus;
    this.billOnly = estimateJob.billOnly;
    this.billingCustomerId = estimateJob.billingCustomerId;
    this.orderCreatedDate = estimateJob.orderCreatedDate
    this.readyToInvoiceChecked = estimateJob.readyToInvoiceDate !== null;;

  }
}
