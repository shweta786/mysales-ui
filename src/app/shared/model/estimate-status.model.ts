export class EstimateStatus {
  static fromJson({id, name}): EstimateStatus {
    return new EstimateStatus(id, name);
  }
  static fromJsonList(array): EstimateStatus[] {
    return array.map(EstimateStatus.fromJson);
  }

  constructor(public id: number, public name: string) {}
}
