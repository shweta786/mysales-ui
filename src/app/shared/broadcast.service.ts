import { Observable, BehaviorSubject } from 'rxjs/Rx';

interface BroadcastEvent {
    key: any;
    data?: any;
}

export class Broadcaster {
  private _eventBus: BehaviorSubject<BroadcastEvent>;

  constructor() {
    this._eventBus = new BehaviorSubject<BroadcastEvent>({key: 0, data: null});
  }

  broadcast(key: any, data?: any) {
    this._eventBus.next({key, data});
  }

  on<T>(key: any): Observable<T> {
    return this._eventBus.asObservable()
      .filter(event => event.key === key)
      .map(event => <T>event.data);
  }
}
