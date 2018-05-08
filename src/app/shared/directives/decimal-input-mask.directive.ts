import { Directive, HostListener, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import { NgModel, NgControl } from '@angular/forms';

@Directive({
    selector: '[appDecimalInputMask]'
})
export class DecimalInputMaskDirective implements OnInit {

    constructor(private _elementRef: ElementRef, private _model: NgModel,
        private _control: NgControl) {
    }

    ngOnInit(): void {}

    @HostListener('keyup', ['$event'])
    onKeyPress(event: any) {
        debugger;
        let decimalRegex = /^(\d*\.)?\d+$/;
        if (decimalRegex.test(event.target.value)) {
            event.target.value = event.target.value;
        }
        else{
            event.target.value = '0.00';
        }

    }

}
