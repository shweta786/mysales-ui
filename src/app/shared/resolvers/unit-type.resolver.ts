import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UnitTypeService } from '../../services/unit-type.service';
import { UnitType } from '../model/unit-type';
import {ClientService} from "../../services/client.service";

@Injectable()
export class UnitTypeResolver implements Resolve<UnitType[]> {

    constructor(private unitTypeService: UnitTypeService,private clientService: ClientService) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.unitTypeService.getUnitTypes(this.clientService.currentClientId);
    }
}
