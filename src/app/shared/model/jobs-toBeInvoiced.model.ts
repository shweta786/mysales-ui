import { PurchaseOrder } from './purchase-order.model';

export class JobsToBeInvoiced {
    jobId: number;
    jobNumber: string;
    description: string;
    readyToInvoiceDate: number;
    invoiced: number;
    lock: boolean;
    invoice: number;
    estimateId: number;
    projectNumber: string;
    projectName: string;
    brandName: string;
    fileNameString: string = '';
    filePathString: string = ''
    poId: string;
    pos: PurchaseOrder[] = [];

    constructor(jobId: number,
        jobNumber: string,
        description: string,
        readyToInvoiceDate: number,
        invoiced: number,
        lock: boolean,
        invoice: number,
        estimateId: number,
        projectNumber: string,
        projectName: string,
        brandName: string,
        fileNameString: string,
        filePathString: string,
        poId: string,
        pos: PurchaseOrder[]) { }

    static fromJson({jobId, jobNumber, description, readyToInvoiceDate, invoiced, lock, invoice, estimateId, projectNumber, projectName, brandName,
        fileNameString, filePathString, poId, pos}): JobsToBeInvoiced {
        return new JobsToBeInvoiced(jobId, jobNumber, description, readyToInvoiceDate, invoiced, lock, invoice, estimateId, projectNumber, projectName, brandName,
            fileNameString, filePathString, poId, []);
    }

    static fromJsonArray(array): JobsToBeInvoiced[] {
        return array.map(JobsToBeInvoiced.fromJson);
    }
}