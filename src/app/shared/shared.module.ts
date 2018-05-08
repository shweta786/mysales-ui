import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientListComponent } from './client-list/client-list.component';
import { VersionComponent } from './version/version.component';
import { Broadcaster } from './broadcast.service';
import { DateAfterComparerValidator } from './validators/date-after-comparer.validator.directive';
import { ConfirmComponent } from './confirm/index';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from '../logout/logout.component';
import { NumberInputMaskDirective } from '../shared/directives/number-input-mask.directive';
import { DecimalInputMaskDirective } from '../shared/directives/decimal-input-mask.directive';
import { ClickOutsideDocumentDirective } from '../shared/directives/click-outside.directive';
import { LocalVariableDirective } from '../shared/directives/local-variable.directive';



@NgModule({
    imports: [CommonModule, FormsModule, NgbModule],
    declarations: [ClientListComponent,NumberInputMaskDirective, VersionComponent, DateAfterComparerValidator,
        ConfirmComponent, LogoutComponent, DecimalInputMaskDirective, LocalVariableDirective,ClickOutsideDocumentDirective],
    exports: [ClientListComponent,NumberInputMaskDirective, VersionComponent, DateAfterComparerValidator, ConfirmComponent, 
        LogoutComponent, DecimalInputMaskDirective, LocalVariableDirective,ClickOutsideDocumentDirective],
    providers: [Broadcaster]
})
export class SharedModule {
}
