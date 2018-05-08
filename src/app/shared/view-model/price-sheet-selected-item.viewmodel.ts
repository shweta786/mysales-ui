import {PriceSheet} from "../model/price-sheet";
import * as _ from "lodash";
import {EstimateLineItem} from "../model/estimate-line-item.model";
import {EstimateCustomLineItem} from "../model/estimate-custom-line-item.model";
import {Category} from "../model/category.model";
import {Level} from "../model/level";
import { UnitType } from "../model/unit-type";
import { Lookup } from "../model/lookup";
import {EstimateJob} from "../model/estimate-job.model";

export class PriceSheetSelectedItemViewModelComponentInfo {
  constructor(public poCategoryId: number, public poCategory: string, public lineItemId: number, public lineItemCustomId: number, public usedByAtLeastOneJob: boolean) {}
}

export class PriceSheetSelectedItemViewModel {
  public priceSheetId: number;
  public categoryId: number;
  public category: string;
  public levelId: number;
  public level: string;
  public unitTypeId: number;
  public unitType: string;
  public description: string;
  public selected: boolean = false;
  public retired: boolean;
  public price: number;
  public rushable: boolean;
  public discountable: boolean;
  public staticPoCategoryLineItemId: number;
 
  public staticPoCategoryId: number;
  public staticPoCategory: string;
 
  public staticComponentUsedByAtLeastOneJob: boolean;
  public customComponentInfo: PriceSheetSelectedItemViewModelComponentInfo[];

  public get isCustom(): boolean {
    return this.customComponentInfo.find((x) => x.lineItemCustomId !== 0 && x.lineItemCustomId !== null) != void 0;
  }

  public get hasComponent(): boolean {
    return this.staticPoCategoryId > 0 || this.customComponentInfo.length > 0;
  }

  public get customComponentsString(): string {
    return (this.customComponentInfo || []).map((x) => x.poCategory).join(', ');
  }

  public get uniqueCustomComponentInfoId(): string {
    return (this.customComponentInfo || []).map((x) => x.lineItemId + "-" + x.lineItemCustomId).join('_');
  }

  public get usedByAtLeastOneJob(): boolean {
    return this.staticComponentUsedByAtLeastOneJob || this.customComponentInfo.find((x) => x.usedByAtLeastOneJob) != void 0;
  }

  public get nonStaticComponentAndNoComponentsSelected(): boolean {
    return this.staticPoCategoryId === 0 && this.customComponentInfo.length === 0;
  }

  includes(searchValue: string) {
    return (this.category || '').toLowerCase().includes(searchValue) ||
      (this.description || '').toLowerCase().includes(searchValue) ||
      this.price.toString().includes(searchValue) ||
      (this.level || '').toLowerCase().includes(searchValue) ||
      (this.unitType || '').toLowerCase().includes(searchValue) ||
      (this.staticPoCategory || '').toLowerCase().includes(searchValue) ||
      (this.customComponentsString || '').includes(searchValue);
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

  constructor(priceSheet: PriceSheet, lineItems: EstimateLineItem[], groupedCustomLineItems: EstimateCustomLineItem[],
              categories: Category[], levels: Level[], poCategories: Lookup[], jobs: EstimateJob[], unitTypes: UnitType[]) {
    if (!_.isUndefined(priceSheet) && priceSheet !== null) {
      this.priceSheetId = priceSheet.id;
      this.customComponentInfo = [];
      this.staticPoCategoryLineItemId = 0;
      this.categoryId = 0; //category id isn't needed for non-custom line items
      this.category = priceSheet.category;
      this.levelId = 0; //level id isn't needed for non-custom line items
      this.level = priceSheet.level;
      this.unitType = priceSheet.unitType;
      this.unitTypeId = priceSheet.unitTypeId;
      this.description = priceSheet.description;
      this.price = priceSheet.unitPrice;
      this.retired = priceSheet.retired;
      this.discountable =  priceSheet.discountable;
      this.rushable = priceSheet.rushable;
      this.staticPoCategoryId = 0;
      this.staticPoCategory = null;
      if (priceSheet.poCategoryId !== 0 && priceSheet.poCategoryId !== null) {
        let targetComponent = _.find(poCategories, (x) => x.id === priceSheet.poCategoryId);
        if (targetComponent != void 0) {
          this.staticPoCategoryId = priceSheet.poCategoryId;
          this.staticPoCategory = _.find(poCategories, (x) => x.id === priceSheet.poCategoryId).name
        }
        else {
          console.error("Could not find component with id " + priceSheet.poCategoryId);
        }
        let lineItemForPriceSheet = _.filter(lineItems, (x) => x.priceSheetId === priceSheet.id);
        this.selected = lineItemForPriceSheet.length > 0;
        if (this.selected) {
          this.staticPoCategoryLineItemId = lineItemForPriceSheet[0].lineItemId;
          this.staticComponentUsedByAtLeastOneJob = _.filter(jobs, (j) => !_.isUndefined(_.find(j.lineItems, (jli) => jli.lineItemId === this.staticPoCategoryLineItemId && jli.quantity >0))).length > 0;
        }
      }
      else {
        let lineItemsForPriceSheet = _.filter(lineItems, (x) => x.priceSheetId === priceSheet.id);
        this.selected = lineItemsForPriceSheet.length > 0;
        if (this.selected) {
          for (let i = 0; i < lineItemsForPriceSheet.length; i++) {
            let lineItemForPriceSheet = lineItemsForPriceSheet[i];
            let poCategory = poCategories.find((x) => x.id === lineItemForPriceSheet.poCategoryId);
            let poCategoryName = poCategory != void 0 ? poCategory.name : "";
            let usedByAtLeastOneJob = _.filter(jobs, (j) => !_.isUndefined(_.find(j.lineItems, (jli) => jli.lineItemId === lineItemForPriceSheet.lineItemId && jli.quantity >0))).length > 0;
            this.customComponentInfo.push(new PriceSheetSelectedItemViewModelComponentInfo(lineItemForPriceSheet.poCategoryId, poCategoryName, lineItemForPriceSheet.lineItemId, null, usedByAtLeastOneJob));
          }
        }
      }
    }
    else if (!_.isUndefined(groupedCustomLineItems) && groupedCustomLineItems !== null && groupedCustomLineItems.length > 0) {
      this.priceSheetId = 0;
      this.customComponentInfo = [];
      this.staticPoCategoryId = 0;
      this.staticPoCategoryLineItemId = 0; //a custom line item can never have a static component
      this.staticPoCategory = null;
      this.categoryId = groupedCustomLineItems[0].categoryId;
      let category = _.find(categories, (x) => x.id === groupedCustomLineItems[0].categoryId);
      this.category = "";
      if (!_.isUndefined(category)) {
        this.category = category.name;
      }
      this.levelId = groupedCustomLineItems[0].levelId;
      let level = _.find(levels, (x) => x.id === groupedCustomLineItems[0].levelId);
      this.level = "";
      if (!_.isUndefined(level)) {
        this.level = level.name;
      }

      this.unitTypeId = groupedCustomLineItems[0].unitTypeId;
      let unitType = _.find(unitTypes, (x) => x.id == groupedCustomLineItems[0].unitTypeId);
      this.unitType = "";
      if (!_.isUndefined(unitType)) {
        this.unitType = unitType.name;
      }
      this.description = groupedCustomLineItems[0].lineItemDescription;
      this.price = groupedCustomLineItems[0].unitPrice;
      this.selected = true;
      this.retired = false;
      for (let i = 0; i < groupedCustomLineItems.length; i++) {
        let customLineItem = groupedCustomLineItems[i];
        let poCategory = poCategories.find((x) => x.id === customLineItem.poCategoryId);
        let poCategoryName = poCategory != void 0 ? poCategory.name : "";
        let usedByAtLeastOneJob = _.filter(jobs, (j) => !_.isUndefined(_.find(j.lineItems, (jli) => jli.lineItemCustomId === customLineItem.lineItemCustomId))).length > 0;
        this.customComponentInfo.push(new PriceSheetSelectedItemViewModelComponentInfo(customLineItem.poCategoryId, poCategoryName, null, customLineItem.lineItemCustomId, usedByAtLeastOneJob));
      }
    }
    else {
      throw "You must supply either a price sheet or a custom line item to the PriceSheetSelectedItemViewModel constructor";
    }
  }
}
