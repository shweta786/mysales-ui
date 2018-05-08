export class Category {
    static fromJson({id, name}): Category {
      return new Category(id, name);
    }
    static fromJsonList(array): Category[] {
      return array.map(Category.fromJson);
    }

    constructor(public id: number, public name: string) {}
}
