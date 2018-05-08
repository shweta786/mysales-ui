export class JobDescriptionList {
    static fromJson({entityNumberId, entityNumber, description, projectStatus}): JobDescriptionList {
      return new JobDescriptionList(entityNumberId, entityNumber, description,projectStatus);
    }
    static fromJsonList(array): JobDescriptionList[] {
      return array.map(JobDescriptionList.fromJson);
    }
    constructor(public entityNumberId: number, public entityNumber: string, public description: string,public projectStatus:string) {}
}
