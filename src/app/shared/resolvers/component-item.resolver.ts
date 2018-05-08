import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ComponentItemService } from '../../services/component-item.service';
import { ComponentItem } from '../model/component-item.model';
import {ClientService} from "../../services/client.service";

@Injectable()
export class ComponentItemResolver implements Resolve<ComponentItem[]> {

  constructor(private componentItemService: ComponentItemService, private clientService: ClientService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.componentItemService.getComponents(this.clientService.currentClientId);
  }
}
