export class EstimateCustomLineItem {
  public __new: Boolean = false;
  static get empty(): EstimateCustomLineItem { return new EstimateCustomLineItem(0, 0, 0, 0, "", 0, "", 0, 0, ''); }

  static fromJson(json: any): EstimateCustomLineItem {
    return new EstimateCustomLineItem(json.lineItemCustomId, json.estimateId, json.categoryId, json.levelId,
                                      json.lineItemDescription, json.unitPrice, json.notes, json.poCategoryId, json.unitTypeId, json.unitType);
  }
  static fromJsonList(array): EstimateCustomLineItem[] {
    return array.map(EstimateCustomLineItem.fromJson);
  }

  constructor(public lineItemCustomId: number, public estimateId: number, public categoryId: number, public levelId: number,
              public lineItemDescription: string, public unitPrice: number, public notes: string,  public poCategoryId: number,
              public unitTypeId: number, public unitType: string) { }
}
