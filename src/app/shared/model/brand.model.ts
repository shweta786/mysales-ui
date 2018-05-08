export class Brand {
  static fromJson({id, name}): Brand {
    return new Brand(id, name);
  }
  static fromJsonList(array): Brand[] {
    return array.map(Brand.fromJson);
  }

  constructor(public id: number, public name: string) {}
}
