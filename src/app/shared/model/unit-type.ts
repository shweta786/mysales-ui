export class UnitType {
    static fromJson({id, name}): UnitType {
      return new UnitType(id, name);
    }
    static fromJsonList(array): UnitType[] {
      return array.map(UnitType.fromJson);
    }
    constructor(public id: number, public name: string) {}
}
