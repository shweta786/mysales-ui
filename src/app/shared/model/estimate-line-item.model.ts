import * as moment from 'moment';

export class EstimateLineItem {
  public __new: Boolean = false;
  static get empty(): EstimateLineItem { return new EstimateLineItem(0,0, "", null); }

  static fromJson(json: any): EstimateLineItem {
    return new EstimateLineItem(json.lineItemId, json.priceSheetId, json.notes, json.poCategoryId);
  }
  static fromJsonList(array): EstimateLineItem[] {
    return array.map(EstimateLineItem.fromJson);
  }

  constructor(public lineItemId: number, 
    public priceSheetId: number,
     public notes: string, public poCategoryId: number) { }
}
