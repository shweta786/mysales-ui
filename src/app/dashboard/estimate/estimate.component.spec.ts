// /* tslint:disable:no-unused-variable */

// import { TestBed, async, inject } from '@angular/core/testing';
// import { Router, RouterOutlet, RouterLink } from '@angular/router';
// // import { RouterTestingModule } from '@angular/router/testing';
// import { FormsModule } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { HttpModule } from '@angular/http';
// import { EstimateComponent } from './estimate.component';
// import { EstimateService } from '../../services/estimate.service';
// import { Broadcaster } from '../../shared/broadcast.service';
// // import { TableOptions, TableColumn, ColumnMode } from 'angular2-data-table';
// import { Angular2DataTableModule, DataTable } from 'angular2-data-table';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { RouterLinkStubDirective } from '../../../testing/router-stubs';
// import { SecureHttp } from '../../shared/secure-http';
// import { Estimate } from '../../shared/model/estimate.model';
// import * as _ from 'lodash';

// describe('Component: Estimate', () => {
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         EstimateComponent, RouterLinkStubDirective
//       ],
//       imports: [
//         FormsModule,
//         HttpModule,
//         NgbModule,
//         Angular2DataTableModule
//       ],
//       providers: [
//         { provide: EstimateService, useClass: EstimateService },
//         { provide: Broadcaster, useClass: Broadcaster },
//         { provide: SecureHttp, useClass: SecureHttp },
//         { provide: Router, useClass: RouterStub }
//       ]
//     });
//   }));
//   it('should create an instance', inject([EstimateService, Broadcaster], (estimateService: EstimateService, broadcaster: Broadcaster) => {
//     let component = new EstimateComponent(estimateService, broadcaster);
//     expect(component).toBeTruthy();
//   }));
//   describe('when a client is selected', () => {
//     let component: EstimateComponent;
//     beforeEach(inject([EstimateService, Broadcaster], (estimateService: EstimateService, broadcaster: Broadcaster) => {
//       component = new EstimateComponent(estimateService, broadcaster);
//       spyOn(estimateService, 'getEstimates').and.returnValue(Observable.of(getEstimates()));
//       spyOn(estimateService, 'getEstimateCount').and.returnValue(Observable.of(5));
//       component.ngOnInit();
//       broadcaster.broadcast('client-changed', { clientId: 0 });
//     }));
//     it('then the open estimates should be displayed', () => {
//       expect(component.originalEstimates.length).toEqual(10);
//     });

//     it('then the closed estimate count should be displayed', () => {
//       expect(component.closedEstimateCount).toEqual(5);
//     });
//   });
// });

// function getEstimates() {
//   let estimates: Estimate[] = [];
//   _.range(0, 10).forEach(x => {
//     let estimate = new Estimate(0, '', '', '', '', 0, 0, '', '', '', 0, 0, 0, 0, 0, '', '', '', '', '', true);
//     estimates.push(estimate);
//   });
//   return estimates;
// }

// class RouterStub {
//   navigateByUrl(url: string) { return url; }
// }
