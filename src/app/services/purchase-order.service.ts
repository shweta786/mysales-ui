import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SecureHttp } from '../shared/secure-http';
import { environment } from '../../environments/environment';
import { PurchaseOrder } from '../shared/model/purchase-order.model';

import { OpenPurchaseOrder } from '../shared/model/open-purchase-order.model';

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class PurchaseOrderService {

    constructor(private secureHttp: SecureHttp) { }

    getOpenPurchaseOrders(clientId: number): Observable<OpenPurchaseOrder[]> {
        return this.secureHttp.get(`${BASE_URL}/openPO/${clientId}`)
          .map((res: Response) => res.json())
          .map((json: any) => json.data)
          .map(OpenPurchaseOrder.fromJsonArray);
    }

    getPurchaseOrders(clientId: number): Observable<PurchaseOrder[]> {
        let url = `${BASE_URL}/PO/${clientId}`;
        return this.secureHttp.get(url)
          .map((res: Response) => res.json())
          .map((json: any) => json.data)
          .map(PurchaseOrder.fromJsonList);
      }

    saveOpenPurchaseOrders(po: PurchaseOrder, clientId: number): Observable<boolean> {
        let url = `${BASE_URL}/po/${clientId}`;
        return this.secureHttp.post(url, po)
            .map((res: Response) => res.json())
            .catch((err: any) => {
                console.error('Error in Purchase Order service - saveOpenPurchaseOrders');
                return Observable.throw('Error creating Purchase Order');
            });

    }
}