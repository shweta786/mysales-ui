export class EmptyJob {
    // jobId: number;
    // projectStatus:  string;
    // entityNumberId: number;
    // jobNumber: string;
    // description: string;
    // readyToInvoiceDate: Date;
    // invoiced: Date;
    // lock: boolean;
    // invoice: number;
    // estimateId: number;
    // projectNumber: string;
    // projectName: string;
    // brandName: string;
    // dateEntered: Date;

    static fromJsonListForListing(array): EmptyJob[] {
        return array.map(EmptyJob.fromJsonForListing);
    }

    static fromJsonForListing({
        jobId,
        projectStatus,
        entityNumberId,
        jobNumber,
        description,
        readyToInvoiceDate,
        invoiced,
        lock,
        invoice,
        estimateId,
        projectNumber,
        projectName,
        brandName,
        dateEntered}): EmptyJob {
            const emptyJob = new EmptyJob(
                jobId,
                projectStatus,
                entityNumberId,
                jobNumber,
                description,
                readyToInvoiceDate,
                invoiced,
                lock,
                invoice,
                estimateId,
                projectNumber,
                projectName,
                brandName,
                dateEntered);
            return emptyJob;
    }

    constructor(public jobId: number,
        public projectStatus:  string,
        public entityNumberId: number,
        public jobNumber: string,
        public description: string,
        public readyToInvoiceDate: Date,
        public invoiced: Date,
        public lock: boolean,
        public invoice: number,
        public estimateId: number,
        public projectNumber: string,
        public projectName: string,
        public brandName: string,
        public dateEntered: Date) {

    }

    includesAny(searchValues: string[]) {
        let result = true;
        searchValues.filter(x => x.length > 0).forEach(x => {
            if (!this.includes(x.toLowerCase())) {
                result = false;
            }
        });
        return result;
    }

    includes(searchValue: string) {
        return this.projectNumber.toLowerCase().includes(searchValue) ||
            this.projectName.toLowerCase().includes(searchValue) ||
            (this.brandName ? this.brandName : '').toLowerCase().includes(searchValue) ||
            (this.description ? this.description : '').toLowerCase().includes(searchValue) ||
            this.dateEntered.toDateString().toLowerCase().includes(searchValue) ||
            (this.projectStatus ? this.projectStatus : '').toLowerCase().includes(searchValue) ||
            (this.jobNumber ? this.jobNumber : '').toLowerCase().includes(searchValue);
    }
}
