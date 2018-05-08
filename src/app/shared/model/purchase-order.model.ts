import * as moment from 'moment';

export class PurchaseOrder {
  static empty: PurchaseOrder = new PurchaseOrder(0, 0, "", "", "", 0, [], 0, "", true, "", 0);

  static getEmpty(): PurchaseOrder {
    return new PurchaseOrder(0, 0, "", "", "", 0, [], 0, "", true, "", 0);
  }

  static fromJson({ estimatePoId, poId, poNumber, eProNumber, notes, categoryId, logicNumber, poAmount, fileName, retired, poCategoryId }): PurchaseOrder {
    return new PurchaseOrder(estimatePoId, poId, poNumber, eProNumber, notes, categoryId, logicNumber, poAmount, fileName, retired, "", poCategoryId);
  }
  static fromJsonList(array): PurchaseOrder[] {
    return array.map(PurchaseOrder.fromJson);
  }

  constructor(public estimatePoId: number, public poId: number, public poNumber: string, public eProNumber: string, public notes: string,
    public categoryId: number, public logicNumber: any[], public poAmount: number, public fileName: string,
    public retired: boolean, public file: String, public poCategoryId: number) { }

  includes(searchValue: string) {
    return (this.poNumber || '').toLowerCase().includes(searchValue) ||
      (this.eProNumber.toLowerCase() || '').includes(searchValue) ||
      this.logicNumber.toString().includes(searchValue) ||
      this.poAmount.toString().includes(searchValue) ||
      (this.notes.toLowerCase() || '').includes(searchValue);
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
}
