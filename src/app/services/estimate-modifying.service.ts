import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { environment } from '../../environments/environment.prod';


@Injectable()
export class EstimateModifyingService {
    private static _ws: WebSocket;
    static wsObservable: Subject<any> = null;

    static initializeWebSocket(estimateId: number, userName: string) {
        let url;
        if(window.location.protocol ==='https:'){
            const  Location =  environment.apiBaseUrl.replace('http://','').replace('https://','').replace('/data','');
            url=`wss://${Location}/ws/estimateModifyingUser?estimateId=${estimateId}&username=${userName}`;
        }else{
            const  Location =  environment.apiBaseUrl.replace('http://','').replace('https://','').replace('/data','');
            url=`ws://${Location}/estimateModifyingUser?estimateId=${estimateId}&username=${userName}`;
        }

        this.wsObservable = Observable.create((observer: Observer<any>) => {
            if (EstimateModifyingService._ws) {
                EstimateModifyingService._ws.close();
            }
            EstimateModifyingService._ws = new WebSocket(url);

            EstimateModifyingService._ws.onclose = (e) => {
                if (e.wasClean) {
                    observer.complete();
                } else {
                    observer.error(e);
                }
            };

            EstimateModifyingService._ws.onerror = (e) => {
                observer.error(e);
            };

            EstimateModifyingService._ws.onmessage = (e) => {
                observer.next(JSON.parse(e.data));
            };

            return () => {
                EstimateModifyingService._ws.close();
            };
        });


    }
}
