import { Estimate } from "../model/estimate.model";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { EstimateService } from "../../services/estimate.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CategoryService } from '../../services/category.service';
import { Category } from '../model/category.model';
import { PriceSheetService } from "../../services/price-sheet.service";
import { PriceSheet } from "../model/price-sheet";
import { UserService } from "../../services/user.service";
import { User } from "../model/user.model";
import { EstimateStatusService } from "../../services/estimate-status.service";
import { EstimateStatus } from "../model/estimate-status.model";
import { BrandService } from "../../services/brand.service";
import { UnitTypeService } from '../../services/unit-type.service';
import { POCategoryService } from '../../services/poCategory.service';

import { Brand } from "../model/brand.model";
import { ClientService } from "../../services/client.service";
import { Client } from "../model/client.model";
import { LevelService } from "../../services/level.service";
import { Level } from "../model/level";
import { UnitType } from '../model/unit-type';
import { LookupService } from "../../services/lookup.service";
import { Lookup } from '../model/lookup';


import * as _ from "lodash";

@Injectable()
export class EstimateDetailsDataResolver implements Resolve<any> {
  
  constructor(private estimateService: EstimateService, private categoryService: CategoryService,
    private priceSheetService: PriceSheetService, private userService: UserService,
    private estimateStatusService: EstimateStatusService, private brandService: BrandService,
    private clientsService: ClientService, private levelService: LevelService,
    private unitTypeService: UnitTypeService,
    private lookupService: LookupService
  ) {}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let observables = [];
    let data = {
      estimate: null,
      categories: null,
      priceSheets: null,
      contacts: null,
      estimateStatuses: null,
      brands: null,
      clients: null,
      levels: null,
      poCategories: null,
      unitTypes:null
    };

    let o = new Observable(observer => {
      observables.push(new Observable(observer2 => {
        this.estimateService.getById(+route.params["id"]).subscribe((estimate: Estimate) => {
          data.estimate = estimate;
          let observables2 = [];
          observables2.push(this.priceSheetService.getPriceSheets(data.estimate.clientId).do((priceSheets: PriceSheet[]) => {
            data.priceSheets = priceSheets;
          }));
          observables2.push(this.lookupService.get(data.estimate.clientId, this.lookupService.POCATEGORY)
          .do((poCategories: Lookup []) => {
            data.poCategories = poCategories;
          }));
          observables2.push(this.categoryService.getCategories(data.estimate.clientId).do((categories: Category[]) => {
            data.categories = categories;
          }));
          observables2.push(this.levelService.getLevels(data.estimate.clientId).do((levels: Level[]) => {
            data.levels = levels;
          }));
          observables2.push(this.unitTypeService.getUnitTypes(data.estimate.clientId).do((unitTypes: UnitType[]) => {
            data.unitTypes = unitTypes;
          }));
          

          observables2.push(this.brandService.getBrandsByClient(data.estimate.clientId).map((brands: Brand[]) => {
            data.brands = brands;
          }));
          Observable.forkJoin(observables2)
          .subscribe((result) => {
            // _.each(data.priceSheets, (x: PriceSheet) => {
            //   let targetComponent: ComponentItem = _.find(data.components, (y: ComponentItem) => x.componentId === y.id);
            //   if (targetComponent != void 0) {
            //     x.component = targetComponent.name;
            //   }
            // });
            observer2.next();
            observer2.complete();
          })
        });
      }));

      observables.push(this.estimateStatusService.getEstimateStatuses().map((statuses: EstimateStatus[]) => {
        data.estimateStatuses = statuses;
      }));

      observables.push(this.userService.getAll().map((users: User[]) => {
        data.contacts = [];
        let i = 0;
        for (let j of users) {
          for (let k of j.clients) {
            if (k.clientId == this.clientsService.currentClientId) {
              data.contacts[i] = j;
              i++;
              break;
            }
          }
        }

      }));

      Observable.forkJoin(observables).subscribe((result) => {
        observer.next(data);
        observer.complete();
      });
    });

    return o;
  }
}
