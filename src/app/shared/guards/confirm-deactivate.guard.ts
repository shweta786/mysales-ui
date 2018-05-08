import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

@Injectable()
export class ConfirmDeactivateGuard implements CanDeactivate<any> {

    canDeactivate(target: any) {
        if (target.hasChanges && target.hasChanges()) {
            var confirm =  window.confirm('You have unsaved changes, do you want to discard them?');
            return confirm;
        }
        return true;
    }
}
