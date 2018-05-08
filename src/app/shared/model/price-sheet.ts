import * as moment from 'moment';

export class PriceSheet {
    public id: number;
    public category: string;
    public level: string;
    public poCategoryId: number;
    public poCategory: string;
    public componentId: number;
    public component: string;
    public description: string;
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
    public unitType: string;
    public unitTypeId: number;

    static fromJson(json: any): PriceSheet {
        let priceSheet = new PriceSheet();
        priceSheet.id = json.id;
        priceSheet.category = json.category;
        priceSheet.level = json.level;
        priceSheet.poCategoryId = json.poCategoryId;
        priceSheet.componentId = json.componentId;
        priceSheet.description = json.lineItemDescription;
        priceSheet.unitPrice = json.unitPrice;
        priceSheet.retired = json.retired;
        priceSheet.revision = json.revision;
        priceSheet.rollbackFlag = json.rollbackFlag;
        priceSheet.rushable = json.rushable;
        priceSheet.discountable = json.discountable;
        priceSheet.effectiveDate = json.effectiveDate ? moment(json.effectiveDate).format('YYYY-MM-DD') : '';
        priceSheet.expirationDate = json.expirationDate ? moment(json.expirationDate).format('YYYY-MM-DD') : '';
        priceSheet.units = json.units;
        priceSheet.isAssignedToEstimate = json.isAssignedToEstimate;
        priceSheet.unitType = json.unitType;
        priceSheet.unitTypeId = json.unitTypeId
        priceSheet.poCategory = json.poCategory;
        if(priceSheet.expirationDate !== '' && priceSheet.expirationDate <  moment(new Date()).format('YYYY-MM-DD')){
            priceSheet.retired = true;
        }
        return priceSheet;
    }

    static fromJsonArray(array: any): PriceSheet[] {
        return array.map(PriceSheet.fromJson);
    }

    constructor() { }

    includes(searchValue: string) {
        return (this.category || '').toLowerCase().includes(searchValue) ||
            (this.level || '').toLowerCase().includes(searchValue) ||
            (this.poCategory || '').toLowerCase().includes(searchValue) ||
            (this.description || '').toLowerCase().includes(searchValue) ||
            this.unitPrice.toString().toLowerCase().includes(searchValue) ||
            this.effectiveDate.toLowerCase().includes(searchValue) ||
            (this.expirationDate || '').toLowerCase().includes(searchValue) ||
            (this.unitType || '').toLowerCase().includes(searchValue) ||
            this.units.toString().toLowerCase().includes(searchValue);
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
