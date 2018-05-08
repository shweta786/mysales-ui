import { Injectable } from '@angular/core';
import { SecureHttp } from '../shared/secure-http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Brand } from '../shared/model/brand.model';
import { environment } from '../../environments/environment';

import { ClientService } from '../services/client.service'

const BASE_URL = environment.apiBaseUrl;

/*
getBrands(): Observable<Brand[]> {
    return this.http.get(`${BASE_URL}/brands`)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
      .map((json: any) => {
        return null;
      });
  }
*/
@Injectable()
export class BrandService {

  constructor(private http: SecureHttp, private clientService: ClientService) { }

  // getBrands(): Observable<Brand[]> {
  //   console.error("SPOOFING BRAND DATA");
  //   let brands: Brand[] = [
  //     new Brand(1, "Brand 1"),
  //     new Brand(2, "Brand 2")
  //   ];
  //   return Observable.of(brands);
  // }

  getBrands(): Observable<Brand[]> {
    return this.http.get(`${BASE_URL}/brands/` + this.clientService.currentClientId)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
      .map((json: any) => Brand.fromJsonList(json));
  }

  getBrandsByClient(clientId: number): Observable<Brand[]> {

   let brands =  environment.brands[clientId];
   brands =  brands == undefined ? []: brands;

    if (brands.length > 0) {
      return Observable.of(brands)
      .map((json: any) => Brand.fromJsonList(json));
    } else {

    return this.http.get(`${BASE_URL}/brands/` + clientId)
      .map((res: Response) => res.json())
      .map((json: any) => {

        brands.splice(0,brands.length);
        brands.push(...json.data);
        environment.brands[clientId] = brands;
         return brands;
      })
      .map((json: any) => Brand.fromJsonList(json));
    }
  }
}
