import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ClientService } from "../../services/client.service";
import { POCategoryService } from '../../services/poCategory.service';
import { POCategory } from '../model/POCategory.model';

@Injectable()
export class POCategoryResolver implements Resolve<POCategory[]> {

    constructor(private poCategoryService: POCategoryService, private clientService: ClientService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.poCategoryService.getPOCategory(this.clientService.currentClientId);
    }
}
