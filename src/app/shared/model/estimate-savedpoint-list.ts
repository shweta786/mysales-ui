export class EstimateSavedPointList {
    static get empty(): EstimateSavedPointList { return new EstimateSavedPointList(0, 0, 0); }
  
    static fromJson(json: any): EstimateSavedPointList {
      return new EstimateSavedPointList(json.savedPointId, json.savedPoint, json.estimateId);
    }
    static fromJsonList(array): EstimateSavedPointList[] {
      return array.map(EstimateSavedPointList.fromJson);
    }
  
    constructor(public savedPointId: number, public savedPoint: number, public estimateId: number) { }
  }
  