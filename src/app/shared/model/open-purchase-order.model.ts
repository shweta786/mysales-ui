export class OpenPurchaseOrder {
  static empty: OpenPurchaseOrder = new OpenPurchaseOrder(0, "", "", "", "", 0, 0, 0, 0, 0, 0, 0, "");

  static getEmpty(): OpenPurchaseOrder {
    return new OpenPurchaseOrder(0, "", "", "", "", 0, 0, 0, 0, 0, 0, 0, "");
  }

  static fromJson({ poId, poNumber, eProNumber, serviceName, notes, poAmount, openJobs, closedJobs, amountUsed, amountLeft, serviceId, poCategoryId, poCategoryName }): OpenPurchaseOrder {
    return new OpenPurchaseOrder(poId, poNumber, eProNumber, serviceName, notes, poAmount, openJobs, closedJobs, amountUsed, amountLeft, serviceId, poCategoryId, poCategoryName);
  }

  static fromJsonArray(array): OpenPurchaseOrder[] {
    return array.map(OpenPurchaseOrder.fromJson);
  }

  constructor(public poId: number, public poNumber: string, public eProNumber: string, public serviceName: string, public notes: string,
    public poAmount: number, public openJobs: number, public closedJobs: number, public amountUsed: number,
    public amountLeft: number, public serviceId: number, public poCategoryId: number, public poCategoryName: string) { }

  includes(searchValue: string) {
    return this.poNumber.toLowerCase().includes(searchValue) ||
      this.eProNumber.toLowerCase().includes(searchValue) ||
      this.poCategoryName.toLowerCase().includes(searchValue) ||
      this.poAmount.toString().includes(searchValue) ||
      this.amountUsed.toString().includes(searchValue)
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
