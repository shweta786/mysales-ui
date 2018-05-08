import * as moment from 'moment';

export class PriceSheetEstimate {
    static fromJsonArray(array: any): PriceSheetEstimate[] {
        return array.map(PriceSheetEstimate.fromJson);
    }

    static fromJson({estimateId, dateEntered}): PriceSheetEstimate {
        return new PriceSheetEstimate(estimateId, moment(dateEntered).format('YYYY-MM-DD'));
    }

    constructor(public estimateId: number, public dateEntered: string) {}
}