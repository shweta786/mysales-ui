import * as moment from 'moment';

export class PriceSheetForm {
    public id: number;
    public categoryId: number;
    public customerId: number;
    public componentId: number;
    public levelId: number;
    public unitTypeId: number;
    public lineItemDescription: string;
    public unitPrice: number;
    public retired: boolean;
    public revision: boolean;
    public rollbackFlag: boolean;
    public rushable: boolean;
    public discountable: boolean;
    public effectiveDate: string;
    public expirationDate: string;
    public units: number;
    public isAssignedToEstimate: boolean;
    public description: string;
    public poCategory: string;
    public poCategoryId: number;

    static fromJson(json: any): PriceSheetForm {
        let priceSheet = new PriceSheetForm();
        priceSheet.id = json.id;
        priceSheet.categoryId = json.categoryId;
        priceSheet.customerId = json.customerId;
        priceSheet.componentId = json.componentId;
        priceSheet.levelId = json.levelId;
        priceSheet.unitTypeId = json.unitTypelId;
        priceSheet.lineItemDescription = json.lineItemDescription;
        priceSheet.unitPrice = json.unitPrice;
        priceSheet.retired = json.retired;
        priceSheet.revision = json.revision;
        priceSheet.rollbackFlag = json.rollbackFlag;
        priceSheet.rushable = json.rushable;
        priceSheet.discountable = json.discountable;
        priceSheet.effectiveDate =json.effectiveDate ? moment(json.effectiveDate).format('YYYY-MM-DD') : '';
        priceSheet.expirationDate = json.expirationDate ? moment(json.expirationDate).format('YYYY-MM-DD') : '';
        priceSheet.units = json.units;
        priceSheet.isAssignedToEstimate = json.isAssignedToEstimate;
        priceSheet.poCategory = json.poCategory;
        priceSheet.poCategoryId = json.poCategoryId;
        return priceSheet;
    }

    constructor() { }

    initialize() {
        this.retired = false;
        this.revision = false;
        this.rollbackFlag = false;
        this.rushable = false;
        this.discountable = false;
        this.unitTypeId = 0;
    }
}
