import {UserRole} from "../model/user-role.model";
import * as _ from "lodash";

export class UserRolesViewModel {
  public viewEstimate: boolean = false;
  public viewDollarAmount: boolean = false;
  public editEstimateHeader: boolean = false;
  public addEditItems: boolean = false;
  public submitToClient: boolean = false;
  public markReadToInvoice: boolean = false;
  public adjustPriceSheets: boolean = false;
  public costReports: number = 10;
  public lockInvoiced : boolean = false;
  public dirty: boolean = false;
  public delete: boolean = false;

  constructor(public userClientId: number, public clientId: number, public userId: number, public name: string, private rolesArray: UserRole[] = []) {
    if (rolesArray.length > 0) {
      this.mapRoles(rolesArray);
    }
  }

  public mapRoles(arrRoles: UserRole[]) {
    this.viewEstimate = !_.isUndefined(_.find(arrRoles, (x) => { return x.roleId === 1; }));
    this.viewDollarAmount = !_.isUndefined(_.find(arrRoles, (x) => { return x.roleId === 2; }));
    this.editEstimateHeader = !_.isUndefined(_.find(arrRoles, (x) => { return x.roleId === 3; }));
    this.addEditItems = !_.isUndefined(_.find(arrRoles, (x) => { return x.roleId === 4; }));
    this.submitToClient = !_.isUndefined(_.find(arrRoles, (x) => { return x.roleId === 5; }));
    this.markReadToInvoice = !_.isUndefined(_.find(arrRoles, (x) => { return x.roleId === 6; }));
    this.adjustPriceSheets = !_.isUndefined(_.find(arrRoles, (x) => { return x.roleId === 7; }));
    this.costReports = _.find(arrRoles, (x) => { if(x.roleId ==8 ||x.roleId ==9 || x.roleId == 10) return x }) != undefined ? _.find(arrRoles, (x) => { if(x.roleId ==8 ||x.roleId ==9 || x.roleId == 10) return x }).roleId : 10;
    this.lockInvoiced = !_.isUndefined(_.find(arrRoles, (x) => { return x.roleId === 11; }));
  }

  public getRolesArray() {
    let ret: number[] = [];
    if (this.viewEstimate) {
      ret.push(1);
    }
    if (this.viewDollarAmount) {
      ret.push(2);
    }
    if (this.editEstimateHeader) {
      ret.push(3);
    }
    if (this.addEditItems) {
      ret.push(4);
    }
    if (this.submitToClient) {
      ret.push(5);
    }
    if (this.markReadToInvoice) {
      ret.push(6);
    }
    if (this.adjustPriceSheets) {
      ret.push(7);
    }
    if (this.lockInvoiced) {
      ret.push(11);
    }
    return ret;
  }
}
