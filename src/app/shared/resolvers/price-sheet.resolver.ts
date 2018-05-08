import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { PriceSheetService } from '../../services/price-sheet.service';
import { PriceSheetForm } from '../model/price-sheet-form.model';

@Injectable()
export class PriceSheetResolver implements Resolve<PriceSheetForm> {

    constructor(private priceSheetService: PriceSheetService) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.priceSheetService.getPriceSheet(+route.params['id']);
    }
}
