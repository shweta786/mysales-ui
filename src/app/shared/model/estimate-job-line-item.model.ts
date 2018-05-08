import * as moment from 'moment';

export class EstimateJobLineItem {
  static get empty(): EstimateJobLineItem { return new EstimateJobLineItem(0, 0, 0, 0, 0, 0, ''); }

  static fromJson(json: any): EstimateJobLineItem {
    return new EstimateJobLineItem(json.jobLineItemId, json.lineItemId, json.quantity,
                                  json.discountAmount, json.rushAmount, json.lineItemCustomId, json.unitType);
  }
  static fromJsonList(array): EstimateJobLineItem[] {
    return array.map(EstimateJobLineItem.fromJson);
  }

  constructor(public jobLineItemId: number, public lineItemId: number, public quantity: number,
              public discountAmount: number, public rushAmount: number, public lineItemCustomId: number, 
              public unitType: string) { }
}
