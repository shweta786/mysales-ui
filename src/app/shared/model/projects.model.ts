export class Project {
    static fromJson({id, name}): Project {
      return new Project(id, name);
    }
    static fromJsonList(array): Project[] {
      return array.map(Project.fromJson);
    }
    constructor(public id: number, public name: string) {}
}
