import { Injectable } from '@angular/core';
import { SecureHttp } from '../shared/secure-http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Category } from '../shared/model/category.model';
import { environment } from '../../environments/environment';

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class CategoryService {

  constructor(private http: SecureHttp) { }

  getCategories(clientId: number): Observable<Category[]> {
    let categories =  environment.categories[clientId];
    categories =  categories == undefined ? []: categories;
 
     if (categories.length > 0) {
       return Observable.of(categories)
       .map((json: any) => Category.fromJsonList(json));
     } else {
 
     return this.http.get(`${BASE_URL}/categories/` + clientId)
       .map((res: Response) => res.json())
       .map((json: any) => {
 
        categories.splice(0,categories.length);
        categories.push(...json.data);
         environment.categories[clientId] = categories;
          return categories;
       })
       .map((json: any) => Category.fromJsonList(json));
     }
  }
}
