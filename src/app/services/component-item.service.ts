import { Injectable } from '@angular/core';
import { SecureHttp } from '../shared/secure-http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import {ComponentItem} from "../shared/model/component-item.model";

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class ComponentItemService {

  constructor(private http: SecureHttp) { }

  getComponents(clientId: number): Observable<ComponentItem[]> {
    let components =  environment.components[clientId];
    components =  components == undefined ? []: components;
 
     if (components.length > 0) {
       return Observable.of(components)
       .map((json: any) => ComponentItem.fromJsonList(json));
     } else {
 
     return this.http.get(`${BASE_URL}/components/` + clientId)
       .map((res: Response) => res.json())
       .map((json: any) => {
 
        components.splice(0,components.length);
        components.push(...json.data);
         environment.components[clientId] = components;
          return components;
       })
       .map((json: any) => ComponentItem.fromJsonList(json));
     }
  }

}
