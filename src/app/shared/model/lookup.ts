export class Lookup {
    static fromJson({id, name}): Lookup {
      return new Lookup(id, name);
    }
    static fromJsonList(array): Lookup[] {
      return array.map(Lookup.fromJson);
    }
    constructor(public id: number, public name: string) {}
}
