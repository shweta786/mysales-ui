import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../model/user.model';
import { Client } from '../model/client.model';
import { Broadcaster } from '../broadcast.service';
import { UserService } from '../../services/user.service';
import { SalesOrderService } from '../../services/sales-order.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit,OnDestroy {
  @Input() currentUser: User;
  @Output() linkClicked: EventEmitter<any> = new EventEmitter();

  clientId: number;
  canViewPricing: Boolean = false;
  canViewFinance: Boolean;
  public salesOrderCount: number;
  public jobCostCount: number;
  private _apiCallSubscriptions: Subscription[] = [];


  constructor(private broadcaster: Broadcaster, private userService: UserService, private _salesOrderService: SalesOrderService) {
    this.canViewFinance = false;
  }

  ngOnInit() {

    const clientChange =  this.broadcaster.on<Client>('client-changed')
      .subscribe((client) => {
        this.clientId = client.id;
        this.canViewPricing = this.userService.userHasRole(7);
        this.canViewFinance = this.userService.userHasRole(11);
        this.getFinanceCount();
        this.onChangeEvent();
      });
      this._apiCallSubscriptions.push(clientChange);
  }

  onLinkClick(){
    this.linkClicked.emit();
  }

  toggle() {
    let sidebar = document.getElementById('sidebar');
    let content = document.getElementById('content');
    sidebar.classList.toggle('active');
    content.classList.toggle('active');
  }

  getFinanceCount() {
    const salesOrderSub = this._salesOrderService.getAllJobsToBeInvoicedCount().subscribe(result => this.salesOrderCount = result);
    const jobCostSub = this._salesOrderService.getAllJobsReadyToArchivedCount().subscribe(result => this.jobCostCount = result);

    this._apiCallSubscriptions.push(salesOrderSub);
    this._apiCallSubscriptions.push(jobCostSub);
  }

  onChangeEvent() {
    const salesOrderChangeEventSub = this._salesOrderService.jobsToBeInvoicedCountChange.subscribe(
      (response: number) => {
        //this.salesOrderCount = response;
        if (response > 0) { this.getFinanceCount(); };
      }
    );
    const jobCostChangeEventSub = this._salesOrderService.jobsReadyToArchivedChange.subscribe(
      (response: number) => {
        //this.jobCostCount = response;
        if (response > 0) { this.getFinanceCount(); };
      }
    );

    const readToInvoiceJobs = this._salesOrderService.jobsChangedToReadyToInvoice.subscribe(
      (response) => {
        this.getFinanceCount();
      }
    );
    this._apiCallSubscriptions.push(salesOrderChangeEventSub);
    this._apiCallSubscriptions.push(jobCostChangeEventSub);
    this._apiCallSubscriptions.push(readToInvoiceJobs);

  }


  ngOnDestroy(): void {
    this._apiCallSubscriptions.forEach((sub) => sub.unsubscribe());
  }

}
