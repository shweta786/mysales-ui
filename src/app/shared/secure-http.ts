import { Injectable } from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SecureHttp {
constructor(private http: Http, private router: Router) { }

    get(url) {
        return this.http.get(url, this.getRequestOptions())
          .catch((err: Response) => this.handleError(err));
    }

    post(url, data) {
        return this.http.post(url, data, this.getRequestOptions())
          .catch((err: Response) => this.handleError(err));
    }

    put(url, data) {
        return this.http.put(url, data, this.getRequestOptions())
          .catch((err: Response) => this.handleError(err));
    }

    delete(url) {
        return this.http.delete(url, this.getRequestOptions())
          .catch((err: Response) => this.handleError(err));
    }

    private handleError(err: Response) {
        if (err.status === 401) {
            this.router.navigate(['login']);
        }
        return Observable.throw(err);
    }

    private getRequestOptions(): RequestOptions {
      let sessionKey = localStorage.getItem('sessionKey');
      let user = JSON.parse(localStorage.getItem('user')) || { username: '' };
      let username = user['username'];
      let options = new RequestOptions({
        headers: new Headers({
          'Authorization': username + ';' + sessionKey,
          'content-type': 'application/json'
        })
      });
      return options;
    }
}
