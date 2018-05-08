import * as moment from 'moment';
import * as _ from "lodash";
import {EstimateJobLineItem} from "../model/estimate-job-line-item.model";
import {PriceSheet} from "../model/price-sheet";
import {EstimateCustomLineItem} from "../model/estimate-custom-line-item.model";
import {Level} from "../model/level";
import {Category} from "../model/category.model";
import {EstimateLineItem} from "../model/estimate-line-item.model";
import { UnitType } from '../model/unit-type';
import { Lookup } from '../model/lookup';

export class EstimateJobLineItemViewModel {
  public jobLineItemId: number;
  public quantity: number;
  public description: string;
  public lineItemId: number;
  public discountAmount: number;
  public rushAmount: number;
  public discountable: boolean;
  public rushable: boolean;
  public unitPrice: number;
  public lineItemCustomId: number;
  public unitType: string;
  public poCategory:Lookup;

  public get isCustom(): boolean {
    return this.lineItemCustomId !== 0 && this.lineItemCustomId !== null;
  }

  constructor(estimateJobLineItem: EstimateJobLineItem, lineItem: EstimateLineItem, priceSheet: PriceSheet,
              customLineItem: EstimateCustomLineItem, categories: Category[], levels: Level[], 
              poCategories: Lookup[], unitTypes: UnitType[]) {
    this.jobLineItemId = estimateJobLineItem !== null && !_.isUndefined(estimateJobLineItem) ? estimateJobLineItem.jobLineItemId : 0;
    this.quantity = estimateJobLineItem !== null && !_.isUndefined(estimateJobLineItem) ? estimateJobLineItem.quantity : 0;

    if (!_.isUndefined(priceSheet) && priceSheet !== null) {
      this.poCategory = _.find(poCategories, (x) => lineItem !== null && x.id === lineItem.poCategoryId);
      this.description = 
      // (targetComponent != void 0 ? targetComponent.name + " - " : "") + 
      (priceSheet.category !== null ? priceSheet.category : "NO CATEGORY") 
      + ' - ' + priceSheet.description + ' - ' 
      + (priceSheet.level !== null ? priceSheet.level : "NO LEVEL");
      this.lineItemId = lineItem.lineItemId;
      this.lineItemCustomId = null;
      this.unitType = priceSheet.unitType;
      this.unitPrice = priceSheet.unitPrice;
      this.rushable = priceSheet.rushable;
      this.discountable = priceSheet.discountable;
      this.discountAmount = estimateJobLineItem !== null && !_.isUndefined(estimateJobLineItem) ? this.discountable ? estimateJobLineItem.discountAmount : 0 : 0;
      this.rushAmount = estimateJobLineItem !== null && !_.isUndefined(estimateJobLineItem) ? this.rushable ? estimateJobLineItem.rushAmount : 0 : 0;
    }
    else if (!_.isUndefined(customLineItem) && customLineItem !== null) {
      let category = _.find(categories, (x) => x.id === customLineItem.categoryId);
      let level = _.find(levels, (x) => x.id === customLineItem.levelId);
      let unitType = _.find(unitTypes, (x) => x.id == customLineItem.unitTypeId);
      this.poCategory = _.find(poCategories, (x) => x.id === customLineItem.poCategoryId);
      this.description = 
      //  (targetComponent != void 0 ? targetComponent.name + " - " : "") +
        (_.isUndefined(category) ? "NO CATEGORY" : category.name)
         + ' - ' + customLineItem.lineItemDescription + " - "
          + (_.isUndefined(level) ? "NO LEVEL" : level.name);
      this.lineItemId = null;
      this.unitType = !_.isUndefined(unitType) ? unitType.name : "";
      this.lineItemCustomId = customLineItem.lineItemCustomId;
      this.unitPrice = customLineItem.unitPrice;
      this.rushable = false;
      this.discountable = false;
      this.discountAmount = 0;
      this.rushAmount = 0;
    }
    else {
      throw "You must supply either a price sheet or a custom line item to the EstimateJobLineItemViewModel constructor";
    }
  }
}
