import { ToastsManager, ToastOptions } from 'ng2-toastr';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { EstimateService } from '../../services/estimate.service';
import { Estimate } from '../../shared/model/estimate.model';
import { Client } from '../../shared/model/client.model';
//import { TableOptions, TableColumn, ColumnMode } from 'angular2-data-table';
import { Broadcaster } from '../../shared/broadcast.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
//import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Optional } from '@angular/core';
import { overlayConfigFactory } from 'angular2-modal';
import { User } from '../../shared/model/user.model';
import { ClientService } from '../../services/client.service';
import { UserService } from '../../services/user.service';
import { SpinnyService } from '../../shared/spinny/spinny.service';
import { Router } from '@angular/router';
import { BillingNumberService } from '../../services/billing-number.service';
import { EstimateStatus } from '../../shared/model/estimate-status.model';
import { EstimateStatusService } from '../../services/estimate-status.service';
import { BrandService } from '../../services/brand.service';
import { ProjectService } from '../../services/project.service';
import { Brand } from '../../shared/model/brand.model';
import { EmptyJob } from './../../shared/model/empty-job.model';
import { checkMode } from '../../../environments/environment';
import * as _ from 'lodash';
import { EstimateJob } from '../../shared/model/estimate-job.model';
import { EstimateJobViewModel } from '../../shared/view-model/estimate-job.viewmodel';
import { JobsToBeInvoiced } from '../../shared/model/jobs-toBeInvoiced.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.less']
})
export class EstimateComponent implements OnInit, OnDestroy {

  @ViewChild('currencyTemplate') currencyTemplate: TemplateRef<any>;
  @ViewChild('numberTemplate') numberTemplate: TemplateRef<any>;
  @ViewChild('poAmountTemplate') poAmountTemplate: TemplateRef<any>;
  @ViewChild('poTemplate') poTemplate: TemplateRef<any>;
  @ViewChild('notesTemplate') notesTemplate: TemplateRef<any>;
  @ViewChild('linkTemplate') linkTemplate: TemplateRef<any>;
  @ViewChild('jobsTemplate') jobsTemplate: TemplateRef<any>;
  @ViewChild('tmplAddEstimate') tmplAddEstimate: TemplateRef<any>;
  @ViewChild('tmplNotesPopup') tmplNotesPopup: TemplateRef<any>;
  @ViewChild('tmplNotesCol') tmplNotesCol: TemplateRef<any>;
  @ViewChild('projectNoLinkTemplate') projectNoLinkTemplate: TemplateRef<any>
  @ViewChild('tmplLockCol') tmplLockCol: TemplateRef<any>;
  @ViewChild('tmplJobCostCol') tmplJobCostCol: TemplateRef<any>;
  @ViewChild('tmplInvoiceReportCol') tmplInvoiceReportCol: TemplateRef<any>;
  @ViewChild('linkFileTemplate') linkFileTemplate: TemplateRef<any>;
  @ViewChild('tmplDateEntered') tmplDateEntered: TemplateRef<any>;
  @ViewChild('tmplNumberHeader') tmplNumberHeader: TemplateRef<any>;

  // options: TableOptions = null;
  // jobOptions: TableOptions = null;
  searchValue = '';
  statusFilter = 'emptyjobs';
  closedEstimatesLoaded = false;
  openEstimatesLoaded = false;
  openEstimates$: Observable<Estimate[]>;
  openEstimatesSubscription: Subscription;
  closedEstimates$: Observable<Estimate[]>;
  closedEstimateCount$: Observable<number>;
  openEstimateCount$: Observable<number>;
  closedEstimateCountResult = 0;
  openEstimateCountResult = 0;
  subscription: Subscription;
  newEstimate: Estimate = Estimate.empty;
  contacts: User[] = [];
  clients: Client[] = [];
  statuses: EstimateStatus[] = [];
  brands: Brand[] = [];

  filteredEstimates: Estimate[] = [];
  originalEstimates: Estimate[] = [];
  rows = [];
  notesForPopup = '';

  jobsToBeInvoiced: JobsToBeInvoiced[] = [];
  jobsToBeInvoiced$: Observable<JobsToBeInvoiced[]>;
  jobsToBeInvoicedCount$: Observable<number>;
  jobsToBeInvoicedCountResult = 0;
  currencyCode = '';
  isOldProject: boolean;
  projects = [];
  selectedEntityNumber = '-1';
  emptyJobsLoaded: boolean;
  emptyJobs$: Observable<EmptyJob[]>;
  filteredJobs: EmptyJob[] = [];
  originalJobs: EmptyJob[] = [];
  // emptyJobOptions: TableOptions = null;
  emptyJobCount = 0;
  userHasRole = this.userService.userHasRole.bind(this.userService);

  constructor(private estimateService: EstimateService,
    private broadcaster: Broadcaster,
   // private modal: Modal,
    private userService: UserService,
    private clientService: ClientService,
    private spinnyService: SpinnyService,
    private vcRef: ViewContainerRef,
    private route: Router,
    private billingNumberService: BillingNumberService,
    private estimateStatusService: EstimateStatusService,
    private brandService: BrandService,
    private projectService: ProjectService,
    private _toastr: ToastsManager, private _toastOptions: ToastOptions
  ) {
    this._toastOptions.animate = 'fade';
    this._toastOptions.toastLife = 2500;
    this._toastOptions.showCloseButton = true;
    this._toastr.setRootViewContainerRef(vcRef);
    // this.spinnyService.defaultViewContainer = vcRef;
    this.isOldProject = false;
    this.projects = [];
  }

  ngOnInit() {
    this.initializeTable();
    this.spinnyService.stop();

    this.subscription = this.broadcaster.on<Client>('client-changed')
      .subscribe((message: any) => {
        if (this.clientService.currentClientId !== -1) {
          this.loadEstimateData(this.clientService.currentClientId);
        }
        this.searchValue = '';
        this.currencyCode = this.clientService.currencyCodeByKey(message.currencyCode);
        this.updateFilter('');
        this.statusFilter = 'open';
      });
    // this.projectService.getProjects(this.clientService.currentClientId).subscribe((result) => {
    //   this.projects = result;
    //   console.log(result);
    // });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openNotesPopup(row) {
    this.notesForPopup = row.notes;
    //this.modal.open(this.tmplNotesPopup, overlayConfigFactory({ isBlocking: true }, BSModalContext));
  }

  loadEstimateData(clientId: number) {
    this.spinnyService.start();
    this.openEstimates$ = this.estimateService.getEstimates(clientId, 'open');
    this.openEstimatesLoaded = false;
    this.openEstimateCount$ = this.estimateService.getEstimateCount(clientId, 'open');
    this.closedEstimateCount$ = this.estimateService.getEstimateCount(clientId, 'closed');
    this.closedEstimates$ = this.estimateService.getEstimates(clientId, 'closed');
    this.closedEstimatesLoaded = false;

    this.openEstimatesSubscription = this.openEstimates$.subscribe(estimates => {
      this.originalEstimates.splice(0, this.originalEstimates.length);
      this.filteredEstimates.splice(0, this.filteredEstimates.length);
      this.originalEstimates.push(...estimates);
      this.filteredEstimates.push(...estimates);
      this.openEstimatesLoaded = true;    //when page is loaded, openEstimate is loaded first.
    },
      error => console.log(error),
      () => { }
    );
    this.emptyJobs$ = this.estimateService.getEmptyJobs(clientId);
    this.emptyJobsLoaded = false;

    this.closedEstimateCount$.subscribe(data => {
      this.closedEstimateCountResult = data;
    });

    this.openEstimateCount$.subscribe(data => {
      this.openEstimateCountResult = data;
    });

    this.emptyJobs$.subscribe(
      emptyjobs => {
        this.filteredJobs.splice(0, this.filteredJobs.length);
        this.originalJobs.push(...emptyjobs);
        this.filteredJobs.push(...emptyjobs);
        this.emptyJobCount = emptyjobs.length;
        this.emptyJobsLoaded = true;
      }, (err) => { },
      () => {
        this.spinnyService.stop();
      }
    );
    this.originalJobs.splice(0, this.originalJobs.length);
    // this.loadJobsToBeInvoiced();
  }

  loadJobsToBeInvoiced() {
    let files: any[] = [];
    let clientId = this.clientService.currentClientId;
    this.jobsToBeInvoiced$ = this.estimateService.getjobsToBeInvoiced(clientId);
    this.jobsToBeInvoiced$
      .subscribe((jobs) => { this.jobsToBeInvoiced = jobs; console.log(jobs) })
      .add(() => {
        this.jobsToBeInvoiced.forEach(job => {
          let counter = 0;
          job.pos.map(pos => {
            if (pos.fileName != '') {
              counter++;
              //pos.fileName = pos.fileName.substring(pos.fileName.lastIndexOf('\\') + 1, pos.fileName.length) + ',';
              pos.fileName = pos.fileName.replace(/^.*[\\\/]/, '') + ','
            }
          });
          if (counter > 0)
            job.pos[counter - 1].fileName = job.pos[counter - 1].fileName.slice(0, -1);
        });
      });
    this.jobsToBeInvoicedCount$ = Observable.of(this.jobsToBeInvoiced.length);
    this.jobsToBeInvoicedCount$.subscribe((jobs) => this.jobsToBeInvoicedCountResult = jobs);
  }

  checkInvoiceAmount(estimate: Estimate) {
    let classes = {
      'label': estimate.totalEstimate > estimate.poAmount && estimate.poAmount,
      'label-danger': estimate.totalEstimate > estimate.poAmount && estimate.poAmount
    };
    return classes;
  }

  updateFilter(searchValue: string) {
   // this.options.offset = 0;
    this.searchValue = searchValue;
    let searches = searchValue.split(' ');
    this.filteredEstimates.splice(0, this.filteredEstimates.length);

    let temp: any = [];
    if (this.statusFilter === 'open') {
      temp = this.originalEstimates.filter(estimate => {
        return estimate.includesAny(searches) && (estimate.status !== 'Closed' && !estimate.retired);
      });
    }

    if (this.statusFilter === 'closed') {
      temp = this.originalEstimates.filter(estimate => {
        return estimate.includesAny(searches) && (this.statusFilter === 'Closed' && estimate.retired);
      });
    }

    this.filteredEstimates.push(...temp);

    this.filteredJobs.splice(0, this.filteredJobs.length);
    let tempJobs = [];
    if (this.statusFilter === 'emptyjobs') {
      tempJobs = this.originalJobs.filter((job: EmptyJob) => {
        return job.includesAny(searches);
      });
    }
    this.filteredJobs.push(...tempJobs);
  }

  initializeTable() {

    //this.options = new TableOptions({
    //   columnMode: ColumnMode.force,
    //   headerHeight: 'auto',
    //   footerHeight: false,
    //   rowHeight: 'auto',
    //   scrollbarH: true,
    //   // limit: 10,
    //   columns: [
    //     new TableColumn({ prop: 'projectNumber', name: 'Project #', width: 90, cellTemplate: this.linkTemplate }),
    //     new TableColumn({ prop: 'projectName', name: 'Project Name', width: 120 }),
    //     new TableColumn({ prop: 'brandName', name: 'Brand', width: 120 }),
    //     // new TableColumn({ prop: 'po', name: 'PO', width: 70, cellTemplate: this.poTemplate }),
    //     new TableColumn({ prop: 'poAmount', width: 100, name: 'PO Amount', cellTemplate: this.poAmountTemplate, headerTemplate: this.tmplNumberHeader }),
    //     new TableColumn({ prop: 'jobCount', width: 50, name: 'Jobs', cellTemplate: this.numberTemplate, headerTemplate: this.tmplNumberHeader }),
    //     new TableColumn({ prop: 'dateEntered', width: 100, name: 'Date Entered', cellTemplate: this.tmplDateEntered, headerTemplate: this.tmplNumberHeader }),
    //     new TableColumn({ prop: 'status', width: 80, name: 'Estimate Status' }),
    //     new TableColumn({ prop: 'totalEstimate', name: 'Total Estimate', cellTemplate: this.currencyTemplate, width: 100, headerTemplate: this.tmplNumberHeader }),
    //     new TableColumn({ prop: 'invoicedToDate', name: 'Invoiced to Date', cellTemplate: this.currencyTemplate, width: 120, headerTemplate: this.tmplNumberHeader }),
    //     new TableColumn({ prop: 'toBeInvoiced', name: 'To be Invoiced', cellTemplate: this.currencyTemplate, width: 100, headerTemplate: this.tmplNumberHeader }),
    //     new TableColumn({ prop: 'notes', name: ' ', width: 80, cellTemplate: this.tmplNotesCol, sortable: false })
    //   ]
    // });
    if (this.userHasRole(2)) {
      //this.options = new TableOptions({
    //     columnMode: ColumnMode.force,
    //     headerHeight: 'auto',
    //     footerHeight: false,
    //     rowHeight: 'auto',
    //     scrollbarH: true,
    //     // limit: 10,
    //     columns: [
    //       new TableColumn({ prop: 'projectNumber', name: 'Project #', width: 90, cellTemplate: this.linkTemplate }),
    //       new TableColumn({ prop: 'projectName', name: 'Project Name', width: 120 }),
    //       new TableColumn({ prop: 'brandName', name: 'Brand', width: 120 }),
    //       // new TableColumn({ prop: 'po', name: 'PO', width: 70, cellTemplate: this.poTemplate }),
    //       new TableColumn({ prop: 'poAmount', width: 100, name: 'PO Amount', cellTemplate: this.poAmountTemplate, headerTemplate: this.tmplNumberHeader }),
    //       new TableColumn({ prop: 'jobCount', width: 50, name: 'Jobs', cellTemplate: this.numberTemplate, headerTemplate: this.tmplNumberHeader }),
    //       new TableColumn({ prop: 'dateEntered', width: 100, name: 'Date Entered', cellTemplate: this.tmplDateEntered, headerTemplate: this.tmplNumberHeader }),
    //       new TableColumn({ prop: 'status', width: 80, name: 'Estimate Status' }),
    //       new TableColumn({ prop: 'totalEstimate', name: 'Total Estimate', cellTemplate: this.currencyTemplate, width: 100, headerTemplate: this.tmplNumberHeader }),
    //       new TableColumn({ prop: 'invoicedToDate', name: 'Invoiced to Date', cellTemplate: this.currencyTemplate, width: 120, headerTemplate: this.tmplNumberHeader }),
    //       new TableColumn({ prop: 'toBeInvoiced', name: 'To be Invoiced', cellTemplate: this.currencyTemplate, width: 100 }),
    //       new TableColumn({ prop: 'notes', name: ' ', width: 80, cellTemplate: this.tmplNotesCol, sortable: false })
    //     ]
    //   });
     }

    // this.emptyJobOptions = new TableOptions({
    //   columnMode: ColumnMode.force,
    //   headerHeight: 50,
    //   footerHeight: 50,
    //   rowHeight: 'auto',
    //   scrollbarH: true,
    //   columns: [
    //     new TableColumn({ prop: 'jobNumber', name: 'Job #', width: 90 }),
    //     new TableColumn({ prop: 'projectNumber', name: 'Project #', width: 90, cellTemplate: this.projectNoLinkTemplate }),
    //     new TableColumn({ prop: 'projectName', name: 'Project Name', width: 180 }),
    //     new TableColumn({ prop: 'brandName', name: 'Brand', width: 120 }),
    //     new TableColumn({ prop: 'projectStatus', name: 'Project Status', width: 100 }),
    //     new TableColumn({ prop: 'dateEntered', name: 'Date Entered', width: 180, cellTemplate: this.tmplDateEntered, headerTemplate: this.tmplNumberHeader }),
    //   ]
    // });

    // this.jobOptions = new TableOptions({
    //   columnMode: ColumnMode.force,
    //   headerHeight: 50,
    //   footerHeight: 50,
    //   rowHeight: 'auto',
    //   scrollbarH: true,
    //   // limit: 10,
    //   columns: [
    //     new TableColumn({ prop: 'projectNumber', name: 'Project #', width: 90, cellTemplate: this.projectNoLinkTemplate }),
    //     new TableColumn({ prop: 'jobNumber', name: 'Job #', width: 80 }),
    //     new TableColumn({ prop: 'projectName', name: 'Project Name', width: 180 }),
    //     new TableColumn({ prop: 'brandName', name: 'Brand', width: 120 }),
    //     new TableColumn({ prop: 'invoice', width: 150, name: 'Invoice Amount', cellTemplate: this.poAmountTemplate }),
    //     new TableColumn({
    //       name: 'Lock', prop: 'lock', width: 80, canAutoResize: false, resizeable: false, sortable: false,
    //       cellTemplate: this.tmplLockCol
    //     }),
    //     new TableColumn({
    //       prop: '', width: 120, canAutoResize: false, resizeable: false, sortable: false,
    //       cellTemplate: this.tmplJobCostCol
    //     }),
    //     new TableColumn({
    //       prop: '', width: 220, canAutoResize: false, resizeable: false, sortable: false,
    //       cellTemplate: this.tmplInvoiceReportCol
    //     }),
    //     new TableColumn({
    //       name: 'File', prop: 'fileNameString', width: 380, canAutoResize: false, resizeable: false, sortable: false, cellTemplate: this.linkFileTemplate
    //     }),
    //   ]
    // });
  }

  // method to update lock value for selected job and rebind the grid
  updatejobLockCheckboxValue(event, prop, value, row) {
    // row[prop] = event.target.checked;
    // row.dirty = true;
    // this.spinnyService.start();
    // this.estimateService.updateJobLockValue(row['jobId'], row[prop])
    //   .subscribe((result) => {
    //     this.spinnyService.stop();
    //     if (result)
    //       this.loadJobsToBeInvoiced();
    //     else
    //       console.log('error');
    //   }, (error) => {
    //     console.log('error');
    //     this.loadJobsToBeInvoiced();
    //     this.spinnyService.stop();
    //   });
  }

  setCurrentStatusFilter(status: string) {
    if (status === 'closed') {
      if (!this.closedEstimatesLoaded) {
        this.closedEstimates$.subscribe(
          estimates => {
            this.filteredEstimates.splice(0, this.filteredEstimates.length);
            this.originalEstimates.push(...estimates);
            this.filteredEstimates.push(...estimates);
            this.closedEstimatesLoaded = true;
          },
          error => { },
          () => {
            this.statusFilter = status;
          }
        );
      } else {
        this.filteredEstimates.splice(0, this.filteredEstimates.length);
        let closedEstimates = this.originalEstimates.filter((estimate) => estimate.status == 'Closed');
        this.filteredEstimates.push(...closedEstimates);
        this.statusFilter = status;
      }
    } else if (status === 'open') {
      if (!this.openEstimatesLoaded) {
        this.openEstimatesSubscription = this.openEstimates$.subscribe(estimates => {
          this.originalEstimates.splice(0, this.originalEstimates.length);
          this.filteredEstimates.splice(0, this.filteredEstimates.length);
          this.originalEstimates.push(...estimates);
          this.filteredEstimates.push(...estimates);
          this.openEstimatesLoaded = true;
        },
          error => console.log(error),
          () => { this.statusFilter = status; }
        );
      } else {
        this.statusFilter = status;
        this.updateFilter('');
      }
      // this is the options offset that controls the page of the data table. It's zero indexed.
      //this.options.offset = 0;
    } else if (status === 'emptyjobs') {
      if (!this.emptyJobsLoaded) {
        this.emptyJobs$.subscribe(
          emptyjobs => {
            this.filteredJobs.splice(0, this.filteredJobs.length);
            this.originalJobs.push(...emptyjobs);
            this.filteredJobs.push(...emptyjobs);
            this.emptyJobCount = emptyjobs.length;
            this.emptyJobsLoaded = true;
          },
          error => { },
          () => {
            this.statusFilter = status;
          }
        );
      } else {
        this.filteredJobs.splice(0, this.filteredJobs.length);
        let closedJobs = this.originalJobs;
        this.filteredJobs.push(...closedJobs);
        this.statusFilter = status;
      }
    }
  }

  get openEstimateCount() {
    if (this.openEstimatesLoaded) {
      if (this.statusFilter === 'open') {
        // return this.filteredEstimates.filter((estimate) => estimate.status == 'Open').length;
        return this.filteredEstimates.length;
      } else {
        return this.originalEstimates.filter((estimate) => estimate.status != 'Closed').length;
        // return this.originalEstimates.length;
      }
    } else {
      return this.openEstimateCountResult;
    }
  }

  get closedEstimateCount(): number {
    if (this.closedEstimatesLoaded) {
      if (this.statusFilter === 'closed') {
        let count = this.filteredEstimates.filter((estimate) => estimate.status == 'Closed').length;
        return count;
      } else {
        return this.originalEstimates.filter((estimate) => estimate.status == 'Closed').length;
      }
    } else {
      return this.closedEstimateCountResult;
    }
  }

  // fetch count of jobs needing invoicing
  get jobsToBeInvoicedCount(): number {
    return this.jobsToBeInvoiced.length;
  }

  getFileUrl(row: any) {
    return environment.apiBaseUrl + `/pos/file/${row.poId}?token=${localStorage.getItem('sessionKey')}`;
  }

  addEstimate(): void {
    this.newEstimate = Estimate.empty;
    this.newEstimate.clientId = this.clientService.currentClientId;
    this.newEstimate.billingCustomerId = this.clientService.currentClientId;
    this.newEstimate.ptContactId = this.userService.currentUser.id;
    this.spinnyService.start();
    this.isOldProject = false;
    this.selectedEntityNumber = null;
    this.fetchNewEstimateDataAsync().subscribe((result) => {
      this.spinnyService.stop();
      // this.modal.open(this.tmplAddEstimate, overlayConfigFactory({ isBlocking: true }, BSModalContext))
      //   .then((resultPromise) => { // this promise fires when the dialog is opened
      //     return resultPromise.result.then((res) => { // this promise fires when the dialog is closed, Ok = true, Cancel = false
      //       if (res) {
      //         this.addEstimateWorker();
      //       }
      //     });
      //   });
    }, (err) => {
      this.spinnyService.stop();
      this._toastr.error('An error was encountered while fetching client/contact data - ' + err, 'Error');
      //   this.modal.alert()
      //     .size('lg')
      //     .isBlocking(true)
      //     .showClose(true)
      //     .title('Error')
      //     .body('An error was encountered while fetching client/contact data - ' + err)
      //     .open();
    });
  }

  private addEstimateWorker(): void {
    this.spinnyService.start();

    let targetStatus = _.find(this.statuses, (x) => x.name === "Open");

    this.newEstimate.statusId = targetStatus !== void 0 ? targetStatus.id : this.statuses[0].id;
    this.newEstimate.brandId = null;
    this.newEstimate.billingCustomerId = this.clientService.currentClientId
    this.newEstimate.clientId = this.clientService.currentClientId
    this.newEstimate.projectName = this.newEstimate.projectName.trim();

    if (this.isOldProject) {
      let temp = this.projects.find((project) => {
        return project['entityNumberId'] == parseInt(this.selectedEntityNumber)
      });

      this.newEstimate.entityNumberId = temp['entityNumberId'];
      this.newEstimate.projectNumber = temp['entityNumber'];
      this.newEstimate.projectName = temp['description'];
      this.createEstimate();

    } else {

      this.billingNumberService.getNewBillingNumberForProject(this.clientService.currentClient
        , this.newEstimate.billingCustomerId, this.newEstimate.projectName).subscribe((newBillingNumber) => {

          this.newEstimate.entityNumberId = newBillingNumber['entityNumberId'];
          this.newEstimate.projectNumber = newBillingNumber['entityNumber'];
          let estimateId = newBillingNumber['estimateId'];
          this.newEstimate.estimateId = estimateId;

          this.updateEstimate();
          // this.spinnyService.stop();
          // this.route.navigate(['/dashboard/estimateDetails', estimateId]);


        }, (err) => {
          this.spinnyService.stop();
          this._toastr.error('An error was encountered while getting a new billing number - ' + err, 'Error');
          //   this.modal.alert()
          //     .size('lg')
          //     .isBlocking(true)
          //     .showClose(true)
          //     .title('Error')
          //     .body('An error was encountered while getting a new billing number - ' + err)
          //     .open();
        });
    }
  }

  private updateEstimate() {
    this.estimateService.updateEstimateInfo(this.newEstimate).subscribe((response) => {
      this.spinnyService.stop();
      this.route.navigate(['/dashboard/estimateDetails', this.newEstimate.estimateId]);
    }, (err) => {
      this.spinnyService.stop();
      this._toastr.error('An error was encountered while creating the estimate - ' + err, 'Error');
      //   this.modal.alert()
      //     .size('lg')
      //     .isBlocking(true)
      //     .showClose(true)
      //     .title('Error')
      //     .body('An error was encountered while creating the estimate - ' + err)
      //     .open();
    });

  }
  private createEstimate() {
    this.estimateService.createEstimate(this.newEstimate).subscribe((newEstimateId) => {
      this.spinnyService.stop();
      this.route.navigate(['/dashboard/estimateDetails', newEstimateId]);
    }, (err) => {
      this.spinnyService.stop();
      this._toastr.error('An error was encountered while creating the estimate - ' + err, 'Error');
      //   this.modal.alert()
      //     .size('lg')
      //     .isBlocking(true)
      //     .showClose(true)
      //     .title('Error')
      //     .body('An error was encountered while creating the estimate - ' + err)
      //     .open();
    });

  }
  private fetchNewEstimateDataAsync(): Observable<any> {
    let observables = [];

    observables.push(this.userService.getAll().do((users: User[]) => {
      this.contacts = [];
      let i = 0;
      for (let j of users) {
        for (let k of j.clients) {
          if (k.clientId == this.clientService.currentClientId) {
            this.contacts[i] = j;
            i++;
            break;
          }
        }
      }
      this.contacts = _.filter(this.contacts, (x) => !x.retired);
      //sorting contacts alphabetically
      this.contacts.sort(function (a, b) {
        var nameA = a.displayName.toUpperCase(); // ignore upper and lowercase
        var nameB = b.displayName.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });

    }));
    observables.push(this.clientService.getClients().do((clients: Client[]) => {
      this.clients = clients;
    }));
    observables.push(this.estimateStatusService.getEstimateStatuses().do((statuses: EstimateStatus[]) => {
      this.statuses = statuses;
    }));
    /*
    observables.push(this.brandService.getBrands().do((brands: Brand[]) => {
      this.brands = brands;
    }));
    */

    return Observable.forkJoin(observables);
  }

  calculateJobCost(job: EstimateJobViewModel): void {
    window.open("http://biziq.phototype.com/applanding/executereport.do?__requesttype=immediate&__vp=Applanding&userID=applanding&password=Ph0t0typ32141&invokeSubmit=true&__executableName=/Resources/Reports/Financial/Labor/Job%20Cost.rptdesign&jobNumber=" + job.jobNumber + "&Hide%20Detail=false&__format=pdf" + "&env=" + checkMode.mode, "_blank");
  }

  calculateInvoiceReportCost(job: EstimateJobViewModel) {
    window.open('http://biziq.phototype.com/applanding/executereport.do?__requesttype=immediate&__vp=Applanding&userID=applanding&password=Ph0t0typ32141&invokeSubmit=true&__executableName=/Resources/Reports/Estimator/invoicing.rptdesign&jobNumber=' + job.jobNumber + '&env=' + checkMode.mode, '_blank');
  }
}
