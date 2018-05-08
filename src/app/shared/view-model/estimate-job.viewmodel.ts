import * as _ from "lodash";
import {PriceSheet} from "../model/price-sheet";
import {EstimateJob} from "../model/estimate-job.model";
import {EstimateJobLineItem} from "../model/estimate-job-line-item.model";
import {EstimateJobLineItemViewModel} from "./estimate-job-line-item.viewmodel";
import {Estimate} from "../model/estimate.model";
import * as moment from 'moment';
import {Level} from "../model/level";
import {Category} from "../model/category.model";
import { UnitType } from '../model/unit-type';
import { Lookup } from '../model/lookup';

export class EstimateJobViewModel {
  public jobId: number;
  public jobNumber: string;
  public description: string;
  public notes: String;
  public discountPercent: number;
  public discountAmount: number;
  public rushPercent: number;
  public rushAmount: number;
  public readyToInvoiceDate: string;
  public invoiced: string;
  public lineItems: EstimateJobLineItemViewModel[];
  public readyToInvoiceChecked: boolean;
  public lock : boolean;
  public jobStatus: string;
  public billingCustomerId:number;
  public entityNumberId: string;  
  public billOnly: boolean;
  public invoiceNumber:string;
  public get activities(): number {
    return _.filter(this.lineItems, (x: EstimateJobLineItemViewModel) => x.quantity > 0).length;
  }

  public get totalCost(): number {
    return _.sumBy(this.lineItems, (x) => (x.quantity * x.unitPrice));
  }

  public get totalDiscountableCost(): number {
    return _.sumBy(_.filter(this.lineItems, (x) => x.discountable), (y) => (y.quantity * y.unitPrice));
  }

  public get totalRushableCost(): number {
    return _.sumBy(_.filter(this.lineItems, (x) => x.rushable), (y) => (y.quantity * y.unitPrice));
  }

  get ready(): boolean {
    return this.readyToInvoiceDate !== '' && this.readyToInvoiceDate !== null;
  }

 

  public  poCategoryLineItem(poCategoryId: number): EstimateJobLineItemViewModel[]{
   return  _.filter(this.lineItems, (x) => {
      x.poCategory.id =  poCategoryId;
    })
  }


  includes(searchValue: string) {
    return (this.jobNumber || '').toLowerCase().includes(searchValue) ||
      (this.description || '').toLowerCase().includes(searchValue) ||
      this.totalCost.toString().includes(searchValue) ||
      (this.jobStatus || '').toLowerCase().includes(searchValue);
  }

  includesAny(searchValues: string[]) {
      let result = true;
      searchValues.filter(x => x.length > 0).forEach(x => {
          if (!this.includes(x.toLowerCase())) {
              result = false;
          }
      });
      return result;
  }

  constructor(job: EstimateJob, estimate: Estimate, priceSheets: PriceSheet[], categories: Category[], levels: Level[],
    poCategories: Lookup[], unitTypes: UnitType[]) {
    this.jobId = job.jobId;
    this.jobNumber = job.jobNumber;
    this.description = job.description;
    this.notes = job.notes;
    this.readyToInvoiceDate = job.readyToInvoiceDate === null ? null : moment(job.readyToInvoiceDate).format("YYYY-MM-DD [at] h:mm A");
    this.invoiced = job.invoiced === null ? null : moment(job.invoiced).format("YYYY-MM-DD [at] h:mm A");
    this.readyToInvoiceChecked = job.readyToInvoiceDate !== null;;
    this.lock = job.lock;
    this.lineItems = [];
    this.jobStatus = job.jobStatus;
    this.billingCustomerId = job.billingCustomerId;
    this.entityNumberId = job.entityNumberId;
    this.billOnly= job.billOnly;
    this.invoiceNumber=job.invoiceNumber;
    //the lineItems array in the estimate tells us what price sheets are used on this estimate
    let priceSheetsForEstimate = _.filter(priceSheets, (ps) => { return !_.isUndefined(_.find(estimate.lineItems, (x) => x.priceSheetId === ps.id)); });
    let estimateLineItemsForJob = _.filter(estimate.lineItems, (li) => { return !_.isUndefined(_.find(job.lineItems, (x) => x.lineItemId === li.lineItemId)); });
    //let estimateCustomLineItemsForJob = _.filter(estimate.customLineItems, (cli) => { return !_.isUndefined(_.find(job.lineItems, (x) => x.lineItemCustomId === cli.lineItemCustomId)); });

    for (let ps of priceSheetsForEstimate)
    {
      let estimateJobLineItem = null;
      let estimateLineItemsForPriceSheet = _.filter(estimate.lineItems, (x) => x.priceSheetId === ps.id);
      for (let estimateLineItemForPriceSheet of estimateLineItemsForPriceSheet) {
        estimateJobLineItem = null;
        let estimateLineItemsForJobForPriceSheet = _.filter(estimateLineItemsForJob, (x) => x.lineItemId === estimateLineItemForPriceSheet.lineItemId);
        if (estimateLineItemsForJobForPriceSheet.length > 0) {
          for (let estimateLineItemForJobForPriceSheet of estimateLineItemsForJobForPriceSheet) {
            estimateJobLineItem = _.find(job.lineItems, (x) => x.lineItemId === estimateLineItemForJobForPriceSheet.lineItemId);
            this.lineItems.push(new EstimateJobLineItemViewModel(estimateJobLineItem, estimateLineItemForPriceSheet, ps, null, null, null, poCategories, unitTypes));
          }
        }
        else {
          this.lineItems.push(new EstimateJobLineItemViewModel(estimateJobLineItem, estimateLineItemForPriceSheet, ps, null, null, null, poCategories, unitTypes));
        }
      }
    }
    for (let cli of estimate.customLineItems) {
      let estimateJobLineItem = _.find(job.lineItems, (x) => x.lineItemCustomId === cli.lineItemCustomId);
      if (_.isUndefined(estimateJobLineItem)) {
        estimateJobLineItem = null;
      }
      this.lineItems.push(new EstimateJobLineItemViewModel(estimateJobLineItem, null, null, cli, categories, levels, poCategories, unitTypes));
    }

    this.discountAmount = _.sumBy(_.filter(this.lineItems, (y) => y.quantity > 0), (x) => x.discountAmount);
    this.discountPercent = +((this.discountAmount / this.totalDiscountableCost) * 100.00).toFixed(2);
    if (isNaN(this.discountPercent)) {
      this.discountPercent = 0;
    }
    this.rushAmount = _.sumBy(_.filter(this.lineItems, (y) => y.quantity > 0), (x) =>  x.rushAmount);
    this.rushPercent = +((this.rushAmount / this.totalRushableCost) * 100.00).toFixed(2);
    if (isNaN(this.rushPercent)) {
      this.rushPercent = 0;
    }
  }

  /*
  static calculateLineItemsRawTotalAmount(jobViewModel: EstimateJobViewModel, estimate: Estimate, priceSheets: PriceSheet[]) {
    jobViewModel.lineItemsRawTotalAmount = 0;

    let estimateJob = _.find(estimate.jobs, (x) => x.jobId === jobViewModel.jobId);
    for (let jli of estimateJob.lineItems) {
      let estimateLineItem = _.find(estimate.lineItems, (eli) => eli.lineItemId === jli.lineItemId);
      let priceSheet = _.find(priceSheets, (ps) => ps.id === estimateLineItem.priceSheetId);
      if (!_.isUndefined(priceSheet)) {
        jobViewModel.lineItemsRawTotalAmount += (jli.quantity * priceSheet.unitPrice);
      }
    }
  }
  */
}
