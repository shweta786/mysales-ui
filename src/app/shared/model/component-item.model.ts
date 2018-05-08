export class ComponentItem {
  static fromJson({id, name}): ComponentItem {
    return new ComponentItem(id, name);
  }
  static fromJsonList(array): ComponentItem[] {
    return array.map(ComponentItem.fromJson);
  }

  constructor(public id: number, public name: string) {}
}
