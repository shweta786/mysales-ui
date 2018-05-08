import { UserRole } from './user-role.model';
import { Client } from './client.model';
import * as _ from 'lodash';

export class UserClient {
  public roles: UserRole[];
  constructor(public userClientId: number, public clientId: number) {
    this.roles = [];
  }
}
