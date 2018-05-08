import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { SecureHttp } from '../shared/secure-http';
import { Client } from '../shared/model/client.model';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class ClientService {

  private clientSource = new BehaviorSubject<Client>(null);
  clientMessage = this.clientSource.asObservable();

  private _currentClient: Client;
  currencyCodeMap: Map<string, string> = new Map<string, string>();

  constructor(private secureHttp: SecureHttp) {
    // https://www.rapidtables.com/web/html/html-codes.html
    this.currencyCodeMap.set("ALL", "");
    this.currencyCodeMap.set("AFN", "");
    this.currencyCodeMap.set("ARN", "");
    this.currencyCodeMap.set("AWG", "");
    this.currencyCodeMap.set("AUD", "");
    this.currencyCodeMap.set("AZN", "");
    this.currencyCodeMap.set("BSD", "");
    this.currencyCodeMap.set("BBD", "");
    this.currencyCodeMap.set("BYN", "");
    this.currencyCodeMap.set("BZD", "");
    this.currencyCodeMap.set("BMD", "");
    this.currencyCodeMap.set("BOB", "");
    this.currencyCodeMap.set("BAM", "");
    this.currencyCodeMap.set("BWP", "");
    this.currencyCodeMap.set("BGN", "");
    this.currencyCodeMap.set("BRL", "");
    this.currencyCodeMap.set("BND", "");
    this.currencyCodeMap.set("KHR", "");
    this.currencyCodeMap.set("CAD", "");
    this.currencyCodeMap.set("KYD", "");
    this.currencyCodeMap.set("CLP", "");
    this.currencyCodeMap.set("CNY", "&#165;");
    this.currencyCodeMap.set("COP", "");
    this.currencyCodeMap.set("CRC", "");
    this.currencyCodeMap.set("HRK", "");
    this.currencyCodeMap.set("CUP", "");
    this.currencyCodeMap.set("CZK", "");
    this.currencyCodeMap.set("DKK", "");
    this.currencyCodeMap.set("DOP", "");
    this.currencyCodeMap.set("XCD", "");
    this.currencyCodeMap.set("EGP", "");
    this.currencyCodeMap.set("SVC", "");
    this.currencyCodeMap.set("EUR", "&#8364");
    this.currencyCodeMap.set("FKP", "");
    this.currencyCodeMap.set("FJD", "");
    this.currencyCodeMap.set("GHS", "");
    this.currencyCodeMap.set("GIP", "");
    this.currencyCodeMap.set("GTQ", "");
    this.currencyCodeMap.set("GGP", "");
    this.currencyCodeMap.set("GYD", "");
    this.currencyCodeMap.set("HNL", "");
    this.currencyCodeMap.set("HKD", "");
    this.currencyCodeMap.set("HUF", "");
    this.currencyCodeMap.set("ISK", "");
    this.currencyCodeMap.set("INR", "");
    this.currencyCodeMap.set("IDR", "");
    this.currencyCodeMap.set("IRR", "");
    this.currencyCodeMap.set("IMP", "");
    this.currencyCodeMap.set("ILS", "");
    this.currencyCodeMap.set("JMD", "");
    this.currencyCodeMap.set("JPY", "");
    this.currencyCodeMap.set("JEP", "");
    this.currencyCodeMap.set("KZT", "");
    this.currencyCodeMap.set("KPW", "");
    this.currencyCodeMap.set("KRW", "");
    this.currencyCodeMap.set("KGS", "");
    this.currencyCodeMap.set("LAK", "");
    this.currencyCodeMap.set("LBP", "");
    this.currencyCodeMap.set("LRD", "");
    this.currencyCodeMap.set("MKD", "");
    this.currencyCodeMap.set("MYR", "");
    this.currencyCodeMap.set("MUR", "");
    this.currencyCodeMap.set("MXN", "&#36");
    this.currencyCodeMap.set("MNT", "");
    this.currencyCodeMap.set("MZN", "");
    this.currencyCodeMap.set("NAD", "");
    this.currencyCodeMap.set("NPR", "");
    this.currencyCodeMap.set("ANG", "");
    this.currencyCodeMap.set("NZD", "");
    this.currencyCodeMap.set("NIO", "");
    this.currencyCodeMap.set("NGN", "");
    this.currencyCodeMap.set("NOK", "");
    this.currencyCodeMap.set("OMR", "");
    this.currencyCodeMap.set("PKR", "");
    this.currencyCodeMap.set("PAB", "");
    this.currencyCodeMap.set("PYG", "");
    this.currencyCodeMap.set("PEN", "");
    this.currencyCodeMap.set("PHP", "");
    this.currencyCodeMap.set("PLN", "");
    this.currencyCodeMap.set("QAR", "");
    this.currencyCodeMap.set("RON", "");
    this.currencyCodeMap.set("RUB", "");
    this.currencyCodeMap.set("SHP", "");
    this.currencyCodeMap.set("SAR", "");
    this.currencyCodeMap.set("RSD", "");
    this.currencyCodeMap.set("SCR", "");
    this.currencyCodeMap.set("SGD", "");
    this.currencyCodeMap.set("SBD", "");
    this.currencyCodeMap.set("SOS", "");
    this.currencyCodeMap.set("ZAR", "");
    this.currencyCodeMap.set("LKR", "");
    this.currencyCodeMap.set("SEK", "");
    this.currencyCodeMap.set("CHF", "");
    this.currencyCodeMap.set("SRD", "");
    this.currencyCodeMap.set("SYP", "");
    this.currencyCodeMap.set("TWD", "");
    this.currencyCodeMap.set("THB", "");
    this.currencyCodeMap.set("TTD", "");
    this.currencyCodeMap.set("TRY", "");
    this.currencyCodeMap.set("TVD", "");
    this.currencyCodeMap.set("UAH", "");
    this.currencyCodeMap.set("GBP", "&#163");
    this.currencyCodeMap.set("USD", "$");
    this.currencyCodeMap.set("UYU", "");
    this.currencyCodeMap.set("UZS", "");
    this.currencyCodeMap.set("VEF", "");
    this.currencyCodeMap.set("VND", "");
    this.currencyCodeMap.set("YER", "");
    this.currencyCodeMap.set("ZWD", "");
  }

  getClients(): Observable<Client[]> {

    if (environment.clients.length > 0) {
      return Observable.of(environment.clients);
    } else {

      return this.secureHttp.get(`${BASE_URL}/customers/true`)
        .map((res: Response) => res.json())
        .map((json: any) => {
          environment.clients.splice(0, environment.clients.length);
          environment.clients.push(...json.data);
          return environment.clients;
        });
    }
  }

  getClientsByClientId(clientId: number) {
    return this.secureHttp.get(`${BASE_URL}/customers/clientId/${clientId}`)
      .map((res: Response) => res.json())
      .map((json: any) => {
        json.data.forEach(element => {
          element.name = element.name +' ('+element.city + 
          (element.state != null? ', '+ element.state : '')
          +')';
        });
        return json.data;
      });
  }

  getClientsByClientIds(clientIds: string) {
    return this.secureHttp.get(`${BASE_URL}/customers/clientIds/${clientIds}`)
      .map((res: Response) => res.json())
      .map((json: any) => {
        json.data.forEach(element => {
          element.name = element.name +' ('+element.city + 
          (element.state != null? ', '+ element.state : '')
          +')';
        });
        return json.data;
      });
  }

  getClientsByName(searchTerm, onlyEstimate?: boolean) {
    if (!searchTerm || searchTerm === '') {
      return Observable.of([]);
    }
    if (onlyEstimate === undefined) {
      onlyEstimate = true;
    }
    return this.secureHttp.get(`${BASE_URL}/customers/search/${searchTerm}`)
      .map((res: Response) => res.json())
      .map((json: any) => json.data);
  }

  get currentClientId(): number {
    return parseInt(localStorage.getItem("currentClientId") || "-1");
  }

  get currentClient(): Client {
    return this._currentClient;
  }

  get currencyCode(): string {
    if (this._currentClient != undefined) {
      return this.currencyCodeMap.get(this._currentClient.currencyCode);
    }
    return '';
  }
  public currencyCodeByKey(key) {
    return this.currencyCodeMap.get(key);
  }
  public getUsePOCategory() {
    if (this.currentClient) {
      return this._currentClient.usePoCategory;
    } else {
      return false;
    }
  }
  set currentClient(client) {
    this._currentClient = client;
    localStorage.setItem("currentClientId", client.id.toString());
    this.clientSource.next(client)
  }
}
