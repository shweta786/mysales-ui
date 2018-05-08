import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { SecureHttp } from '../shared/secure-http';
import { Observable } from 'rxjs/Rx';
import { Level } from '../shared/model/level';
import { environment } from '../../environments/environment';

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class LevelService {

  constructor(private http: SecureHttp) { }

  getLevels(clientId: number): Observable<Level[]> {
    
    let levels =  environment.levels[clientId];
    levels =  levels == undefined ? []: levels;
 
     if (levels.length > 0) {
       return Observable.of(levels)
       .map((json: any) => Level.fromJsonList(json));
     } else {
 
     return this.http.get(`${BASE_URL}/levels/` + clientId)
       .map((res: Response) => res.json())
       .map((json: any) => {
 
        levels.splice(0,levels.length);
        levels.push(...json.data);
         environment.levels[clientId] = levels;
          return levels;
       })
       .map((json: any) => Level.fromJsonList(json));
     }
  }

}
