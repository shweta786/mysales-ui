import {Estimate} from "../model/estimate.model";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {EstimateService} from "../../services/estimate.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class EstimateResolver implements Resolve<Estimate> {
  constructor(private estimateService: EstimateService) {}
  resolve(route:ActivatedRouteSnapshot, state:RouterStateSnapshot): Observable<Estimate> {
    return this.estimateService.getById(+route.params["id"]);
  }
}
