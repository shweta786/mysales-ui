import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { LevelService } from '../../services/level.service';
import { Level } from '../model/level';
import {ClientService} from "../../services/client.service";

@Injectable()
export class LevelResolver implements Resolve<Level[]> {

    constructor(private levelService: LevelService, private clientService: ClientService) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.levelService.getLevels(this.clientService.currentClientId);
    }
}
