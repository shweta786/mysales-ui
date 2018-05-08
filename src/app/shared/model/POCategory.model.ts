export class POCategory {
    static fromJson({id, name}): POCategory {
      return new POCategory(id, name);
    }
    static fromJsonList(array): POCategory[] {
      return array.map(POCategory.fromJson);
    }
    constructor(public id: number, public name: string) {}
}
