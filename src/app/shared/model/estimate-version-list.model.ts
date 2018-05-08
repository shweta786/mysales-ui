export class EstimateVersionList {
    static get empty(): EstimateVersionList { return new EstimateVersionList(0, 0, 0, false); }
  
    static fromJson(json: any): EstimateVersionList {
      return new EstimateVersionList(json.versionId, json.version, json.estimateId, json.latest);
    }
    static fromJsonList(array): EstimateVersionList[] {
      return array.map(EstimateVersionList.fromJson);
    }
  
    constructor(public versionId: number, public version: number, public estimateId: number, public latest: boolean) { }
  }
  