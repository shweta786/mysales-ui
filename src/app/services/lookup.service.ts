import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { SecureHttp } from '../shared/secure-http';
import { Observable } from 'rxjs/Rx';
import { Lookup } from '../shared/model/lookup';
import { environment } from '../../environments/environment';
import { ClientService } from '../services/client.service';

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class LookupService {

  public POCATEGORY="PO_CATEGORY";

  constructor(private http: SecureHttp) { }

  get(clientId: number, type:string): Observable<Lookup[]> {
    let lookupType =  environment[type];
    let lookup=[];
   
    if(lookupType ==  undefined){
      environment[type]={};
      lookup = [];
    }else if (lookup[clientId] == undefined){
      lookup = [];
    }else{
      lookup = lookup[clientId];
    }
   
     if (lookup.length > 0) {
       return Observable.of(lookup)
       .map((json: any) => Lookup.fromJsonList(json));
     } else {
 
     return this.http.get(`${BASE_URL}/lookup/${clientId}/${type}`)
       .map((res: Response) => res.json())
       .map((json: any) => {
 
        lookup.splice(0,lookup.length);
        lookup.push(...json.data);
         environment[type][clientId] = lookup;
          return lookup;
       })
       .map((json: any) => Lookup.fromJsonList(json));
     }
  }

}
