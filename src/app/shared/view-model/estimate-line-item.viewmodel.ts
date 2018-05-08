import * as moment from 'moment';
import * as _ from "lodash";
import {Estimate} from "../model/estimate.model";
import {PriceSheet} from "../model/price-sheet";
import {EstimateLineItem} from "../model/estimate-line-item.model";
import {EstimateLineItemJobViewModel} from "./estimate-line-item-job.viewmodel";
import {EstimateJob} from "../model/estimate-job.model";
import {Level} from "../model/level";
import {Category} from "../model/category.model";
import {EstimateCustomLineItem} from "../model/estimate-custom-line-item.model";
import { UnitType } from '../model/unit-type';
import { Lookup } from '../model/lookup';


export class EstimateLineItemViewModel {
  public lineItemId: number;
  public priceSheetId: number;
  public description: string;
  //public categoryId: number;
  public category: string;
  //public levelId: number;
  public poCategory: string;
  public level: string;
  public unitType: string;
  public notes: string;
  public unitPrice: number;
  public jobs: EstimateLineItemJobViewModel[];
  public lineItemCustomId: number;

  public get isCustom(): boolean {
    return this.lineItemCustomId !== 0 && this.lineItemCustomId !== null;
  }

  public get jobsCount(): number {
    return this.jobs.length;
  }

  public get billedCount(): number {
    return _.filter(this.jobs, (x) => x.isInvoiced).length;
  }

  public get readyToBillCount(): number {
    return _.filter(this.jobs, (x) => x.ready && !x.isInvoiced).length;
  }

  public get units(): number {
    return _.sumBy(this.jobs, (x) => x.quantity);
  }

  public get discount(): number {
    return _.sumBy(this.jobs, (x) => x.discountAmount);
  }

  public get rush(): number {
    return _.sumBy(this.jobs, (x) => x.rushAmount);
  }

  public get total(): number {
    return (this.units * this.unitPrice) - this.discount + this.rush;
  }

  public get billed(): number {
    return _.sumBy(this.jobs, (x) => { return x.isInvoiced ? (x.quantity * x.unitPrice) - x.discountAmount + x.rushAmount : 0 });
  }

  public get leftToBill(): number {
    return this.total - this.billed;
  }

  includes(searchValue: string) {
    return (this.poCategory || '').toLowerCase().includes(searchValue) ||
      (this.category || '').toLowerCase().includes(searchValue) ||
      (this.description || '').toLowerCase().includes(searchValue) ||
      (this.level || '').toLowerCase().includes(searchValue) ||
      (this.unitPrice || '').toString().includes(searchValue)
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

  constructor(estimateLineItem: EstimateLineItem, estimate: Estimate, priceSheets: PriceSheet[],
              customLineItem: EstimateCustomLineItem, categories: Category[], levels: Level[], 
              poCategories: Lookup[], unitTypes: UnitType[]) {
    if (!_.isUndefined(estimateLineItem) && estimateLineItem !== null) {
      this.jobs = [];

      let priceSheetForLineItem = _.find(priceSheets, (ps) => ps.id === estimateLineItem.priceSheetId);
      if(priceSheetForLineItem === void 0) {
        console.error("price sheets are broken");
        // the data is broken, bail
        return;
      }
      this.lineItemId = estimateLineItem.lineItemId;
      this.lineItemCustomId = null;
      this.priceSheetId = estimateLineItem.priceSheetId;
      this.description = priceSheetForLineItem.description;
      this.category = priceSheetForLineItem.category;
      this.level = priceSheetForLineItem.level;
      this.unitType = priceSheetForLineItem.unitType;
      this.notes = estimateLineItem.notes;
      this.unitPrice = priceSheetForLineItem.unitPrice;
      let poCategory = _.find(poCategories, (x) => x.id === estimateLineItem.poCategoryId);
      this.poCategory = !_.isUndefined(poCategory) ? poCategory.name : "";

      for (let job of estimate.jobs) {
        let jobLineItemUsingThisLineItem = _.find(job.lineItems, (x) => x.lineItemId === estimateLineItem.lineItemId);
        if (!_.isUndefined(jobLineItemUsingThisLineItem)) {
          this.jobs.push(new EstimateLineItemJobViewModel(job, jobLineItemUsingThisLineItem, estimate.projectNumber, priceSheetForLineItem, null));
        }
      }
    }
    else if (!_.isUndefined(customLineItem) && customLineItem !== null) {
      let category = _.find(categories, (x) => x.id === customLineItem.categoryId);
      let level = _.find(levels, (x) => x.id === customLineItem.levelId);
      let unitType =  _.find(unitTypes, (x) => x.id == customLineItem.unitTypeId);
      let poCategory = _.find(poCategories, (x) => x.id === customLineItem.poCategoryId);
      this.lineItemId = null;
      this.lineItemCustomId = customLineItem.lineItemCustomId;
      this.priceSheetId = null;
      this.description = customLineItem.lineItemDescription;
      this.category = !_.isUndefined(category) ? category.name : "";
      this.level = !_.isUndefined(level) ? level.name : "";
      this.unitType = !_.isUndefined(unitType) ? unitType.name : "";
      this.poCategory = !_.isUndefined(poCategory) ? poCategory.name : "";
      this.notes = customLineItem.notes;
      this.unitPrice = customLineItem.unitPrice;
      this.jobs = [];

      for (let job of estimate.jobs) {
        let jobLineItemUsingThisCustomLineItem = _.find(job.lineItems, (x) => x.lineItemCustomId === customLineItem.lineItemCustomId);
        if (!_.isUndefined(jobLineItemUsingThisCustomLineItem)) {
          this.jobs.push(new EstimateLineItemJobViewModel(job, jobLineItemUsingThisCustomLineItem, estimate.projectNumber, null, customLineItem));
        }
      }
    }
    else {
      throw "You must supply either a line item or a custom line item to the EstimateLineItemViewModel constructor";
    }
  }
}
