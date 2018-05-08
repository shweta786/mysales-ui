import { Injectable, EventEmitter } from '@angular/core';
import { Response } from '@angular/http';
import { SecureHttp } from '../shared/secure-http';
import { Observable } from 'rxjs/Rx';
import { PriceSheet } from '../shared/model/price-sheet';
import { PriceSheetForm } from '../shared/model/price-sheet-form.model';
import { PriceSheetEstimate } from '../shared/model/price-sheet-estimate.model';
import { environment } from '../../environments/environment';

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class PriceSheetService {

  public PriceSheetSaved: EventEmitter<PriceSheetForm>;
  constructor(private http: SecureHttp) {
    this.PriceSheetSaved = new EventEmitter<PriceSheetForm>();
  }

  getPriceSheets(clientId: number): Observable<PriceSheet[]> {
    return this.http.get(`${BASE_URL}/pricings/${clientId}`)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
      .map(PriceSheet.fromJsonArray);
  }

  getPriceSheet(id: number): Observable<PriceSheetForm> {
    return this.http.get(`${BASE_URL}/pricing/${id}`)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
      .map(PriceSheetForm.fromJson);
  }

  createPriceSheet(priceSheet: PriceSheetForm): Observable<boolean> {
    return this.http.post(`${BASE_URL}/pricing`, priceSheet)
      .map((res: Response) => res.json())
      .map((json: any) => {
        return json; // && json.data;
      })
      .catch((error) => {
        return Observable.of(false);
      });
  }

  updatePriceSheet(priceSheet: PriceSheetForm): Observable<boolean> {
    priceSheet.description = priceSheet.lineItemDescription;
    return this.http.put(`${BASE_URL}/pricing/${priceSheet.id}`, priceSheet)
      .map((res: Response) => res.json())
      .catch((error) => {
        return Observable.of(false);
      });

  }

  getEstimates(priceSheetId: number): Observable<PriceSheetEstimate[]> {
    return this.http.get(`${BASE_URL}/pricing/${priceSheetId}/estimates`)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
      .map(PriceSheetEstimate.fromJsonArray);
  }

  deletePriceSheet(priceSheetId: number): Observable<boolean> {
    return this.http.delete(`${BASE_URL}/pricing/${priceSheetId}`)
      .map((res: Response) => res.json())
      .map((json: any) => {
        return json && json.data;
      })
      .catch((error) => {
        return Observable.of(false);
      });
  }

}
