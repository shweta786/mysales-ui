import * as moment from 'moment';
import * as _ from 'lodash';

import { PurchaseOrder } from './purchase-order.model';
import { EstimateLineItem } from './estimate-line-item.model';
import { EstimateJob } from './estimate-job.model';
import { JobList } from './job-list.model';
import { EstimateCustomLineItem } from './estimate-custom-line-item.model';
import { EstimateVersionList } from './estimate-version-list.model';

export class Estimate {
    static get empty(): Estimate {
        return new Estimate(0, '', '', 0, '', '', 0, 0, '', '', 0, '', 0, 0, 0, 0, 0, '', '', 0, '', '', 0, 0, '', true,'',0);
    }
    public pos: PurchaseOrder[];
    public lineItems: EstimateLineItem[];
    public jobs: EstimateJob[];
    public jobList: JobList[];
    public customLineItems: EstimateCustomLineItem[];
    public jobNumbers: string;
    public jobCount: number;

    public get dateEnteredForField() {
        return moment(this.dateEntered).format('YYYY-MM-DD');
    }
    public set dateEnteredForField(val: string) {
        let utcDateTimeString = new Date().toISOString();
        let timeString = utcDateTimeString.slice(utcDateTimeString.indexOf('T'), utcDateTimeString.length);
        this.dateEntered = moment.utc(val + timeString).toISOString();
    }

    static fromJsonListForListing(array): Estimate[] {
        return array.map(Estimate.fromJsonForListing);
    }

    static fromJsonForListing({id, projectNumber, projectName, brandName, poNumber, poAmount, pOAs, dateEntered, notes, status, totalEstimate,
        invoicedToDate, toBeInvoiced, clientId, retired, jobs, version, savedPoint, projectStatus,entityNumberId,billingCustomerId,jobNumbers}): Estimate {

            let estimate = new Estimate(id,
            projectNumber,
            projectName,
            0,
            brandName || '',
            poNumber,
            poAmount,
            pOAs,
            dateEntered,
            notes,
            0,
            status,
            totalEstimate,
            invoicedToDate,
            toBeInvoiced,
            0,
            clientId,
            '',
            '',
            0,
            '',
            '',
            version,
            savedPoint,
            projectStatus,
            retired,
            entityNumberId,
            billingCustomerId);

        estimate.jobList = jobs;
        estimate.jobNumbers =  jobNumbers;
        if (jobNumbers != null) {
            let jobNumberArray = jobNumbers.split(',');
            estimate.jobCount = jobNumberArray.length;
        } else {
            estimate.jobCount = 0;
        }


        return estimate;
    }

    static fromJsonListForDetails(array): Estimate[] {
        return array.map(Estimate.fromJsonForDetails);
    }

    static fromJsonForDetails(json: any): Estimate {
        let newEstimate = new Estimate(json.estimateId,
            json.projectNumber,
            json.projectName,
            json.brandId,
            json.brandName || '',
            json.poNumber,
            json.poAmount,
            json.pOAs,
            json.dateEntered,
            json.notes,
            json.statusId,
            json.status || '',
            json.totalEstimate,
            json.invoicedToDate,
            json.toBeInvoiced,
            json.ptContactId,
            json.clientId,
            json.contactAttn,
            json.contactEmail,
            json.statusUserId,
            json.statusUser,
            json.statusDate,
            json.version,
            json.savedPoint,
            json.projectStatus,
            true,
            json.entityNumberId,
            json.billingCustomerId
        );
        newEstimate.pos = PurchaseOrder.fromJsonList(json.pos);
        newEstimate.lineItems = EstimateLineItem.fromJsonList(json.lineItems);
        newEstimate.jobs = EstimateJob.fromJsonList(json.jobs);
        newEstimate.customLineItems = EstimateCustomLineItem.fromJsonList(json.customLineItems);
        return newEstimate;
    }

    constructor(
        public estimateId: number,
        public projectNumber: string,
        public projectName: string,
        public brandId: number,
        public brandName: string,
        public poNumber: string,
        public poAmount: number,
        public pOAs: number,
        public dateEntered: string,
        public notes: string,
        public statusId: number,
        public status: string,
        public totalEstimate: number,
        public invoicedToDate: number,
        public toBeInvoiced: number,
        public ptContactId: number,
        public clientId: number,
        public contactAttn: string,
        public contactEmail: string,
        public statusUserId: number,
        public statusUser: string,
        public statusDate: string,
        public version: number,
        public savedPoint: number,
        public projectStatus: string,
        public retired: boolean,
        public entityNumberId: string,
        public billingCustomerId:number

    ) {
        this.pos = [];
        this.lineItems = [];
        this.jobs = [];
        this.customLineItems = [];
        this.jobNumbers;
    }

    includes(searchValue: string) {
        return this.projectNumber.toLowerCase().includes(searchValue) ||
            this.projectName.toLowerCase().includes(searchValue) ||
            this.brandName.toLowerCase().includes(searchValue) ||
            (this.poNumber || '').toLowerCase().includes(searchValue) ||
            (this.poAmount || '').toString().toLowerCase().includes(searchValue) ||
            this.pOAs.toString().toLowerCase().includes(searchValue) ||
            this.dateEntered.toString().toLowerCase().includes(searchValue) ||
            this.notes.toLowerCase().includes(searchValue) ||
            this.status.toLowerCase().includes(searchValue) ||
            this.totalEstimate.toString().toLowerCase().includes(searchValue) ||
            this.invoicedToDate.toString().toLowerCase().includes(searchValue) ||
            this.toBeInvoiced.toString().toLowerCase().includes(searchValue) ||
            this.jobListString.toLowerCase().includes(searchValue) ||
            (this.jobs && this.jobs.findIndex(job => job && job.jobNumber.includes(searchValue)) > -1) ;
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

    get jobListString(): string {
        
        if (this.jobNumbers == undefined  ) {
            return 'No jobs';
        }
        return this.jobNumbers;

        // if (this.jobList == undefined  || this.jobList.length === 0) {
        //     return 'No jobs';
        // }
        // let nums = _.uniq(this.jobList.map(x => x.jobNumber));

        // if (nums.length > 4) {
        //     // return nums.slice(0, 4).join() + '...';
        //     return nums.join(', ');
        // } else {
        //     return nums.join(', ');
        // }
    }
}
