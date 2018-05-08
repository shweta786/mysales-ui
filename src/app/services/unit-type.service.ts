import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { SecureHttp } from '../shared/secure-http';
import { Observable } from 'rxjs/Rx';
import { UnitType } from '../shared/model/unit-type';
import { environment } from '../../environments/environment';
import { ClientService } from '../services/client.service';

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class UnitTypeService {

  constructor(private http: SecureHttp) { }


  getUnitTypes(clientId: number): Observable<UnitType[]> {
    let unitTypes =  environment.unitTypes[clientId];
    unitTypes =  unitTypes == undefined ? []: unitTypes;
 
     if (unitTypes.length > 0) {
       return Observable.of(unitTypes)
       .map((json: any) => UnitType.fromJsonList(json));
     } else {
 
     return this.http.get(`${BASE_URL}/lookup/${clientId}/${'UNIT_TYPE'}`)
       .map((res: Response) => res.json())
       .map((json: any) => {
 
        unitTypes.splice(0,unitTypes.length);
        unitTypes.push(...json.data);
         environment.unitTypes[clientId] = unitTypes;
          return unitTypes;
       })
       .map((json: any) => UnitType.fromJsonList(json));
     }
  }

}
