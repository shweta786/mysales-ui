import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { SecureHttp } from '../shared/secure-http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { ClientService } from '../services/client.service';
import { POCategory } from '../shared/model/POCategory.model';

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class POCategoryService {

  constructor(private http: SecureHttp) { }


  getPOCategory(clientId: number): Observable<POCategory[]> {
    let poCategory = environment.poCategory[clientId];
    poCategory = poCategory == undefined ? [] : poCategory;

    if (poCategory.length > 0) {
      return Observable.of(poCategory)
        .map((json: any) => POCategory.fromJsonList(json));
    } else {

      return this.http.get(`${BASE_URL}/lookup/${clientId}/${'PO_CATEGORY'}`)
        .map((res: Response) => res.json())
        .map((json: any) => {

          poCategory.splice(0, poCategory.length);
          poCategory.push(...json.data);
          environment.poCategory[clientId] = poCategory;
          return poCategory;
        })
        .map((json: any) => POCategory.fromJsonList(json));
    }
  }

}
