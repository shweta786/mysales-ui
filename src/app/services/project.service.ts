import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { SecureHttp } from '../shared/secure-http';
import { Project } from '../shared/model/projects.model';
import { environment } from '../../environments/environment';

const BASE_URL = environment.apiBaseUrl;

@Injectable()
export class ProjectService {

  constructor(private http: SecureHttp) { }

  getProjects(clientId: number): Observable<Project[]> {
    return this.http.get(`${BASE_URL}/projects/${clientId}/0`)
      .map((res: Response) => res.json())
      .map((json: any) => json.data)
  }

}
