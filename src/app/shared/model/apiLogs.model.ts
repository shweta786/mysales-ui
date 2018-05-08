export class APILogs {
    constructor(public apiLogId: number, public createdBy: string,
        public createdDate: string, public status: string, public requestType: string, public requestObject: string,
        public responseObject: string) { }

    static empty: APILogs = new APILogs(0, "", "", "", "", "", "");
    static dates: Date[] = [];
    static fromJson({ apiLogId, createdBy, createdDate, status, requestType, requestObject, responseObject }): APILogs {
        return new APILogs(apiLogId, createdBy, createdDate, status, requestType, requestObject, responseObject);
    }

    static fromJsonList(array): APILogs[] {
        for (let i in array) {
            APILogs.dates[i] = array[i].createdDate;  //saving date in original format
        }
        return array.map(APILogs.fromJson);
    }
}