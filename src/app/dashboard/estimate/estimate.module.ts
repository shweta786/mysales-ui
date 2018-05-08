import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EstimateComponent }   from './estimate.component';
import { ProjectService } from '../../services/project.service';
// import { SharedModule } from '../../shared/shared.module';
// import { ClientListComponent } from '../../shared/client-list/client-list.component';

@NgModule({
    imports: [CommonModule, NgbModule, FormsModule, RouterModule],
    exports: [],
    declarations: [EstimateComponent],
    providers: [ ProjectService ],
})
export class EstimateModule { }
