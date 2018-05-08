export class Level {
    static fromJson({id, name}): Level {
      return new Level(id, name);
    }
    static fromJsonList(array): Level[] {
      return array.map(Level.fromJson);
    }
    constructor(public id: number, public name: string) {}
}
