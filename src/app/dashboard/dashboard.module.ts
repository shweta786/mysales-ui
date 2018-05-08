import { EstimateModule } from './estimate/estimate.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TopNavComponent } from '../shared/topnav/topnav.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { TopNavModule } from '../shared/topnav/topnav.module';
import { SalesOrderService } from '../services/sales-order.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgbModule.forRoot(),
        TopNavModule,
        EstimateModule,
        SharedModule
    ],
    providers: [SalesOrderService],
    declarations: [DashboardComponent, SidebarComponent, TopNavComponent],
    exports: [DashboardComponent, SidebarComponent, TopNavComponent],
})

export class DashboardModule { }
