export class JobList {
    static fromJson({jobId, jobNumber}): JobList {
      return new JobList(jobId, jobNumber);
    }
    static fromJsonList(array): JobList[] {
      return array.map(JobList.fromJson);
    }
    constructor(public jobId: number, public jobNumber: string) {}
}
