import { Directive, HostListener, ElementRef, OnInit } from '@angular/core';
import { NgModel, NgControl } from '@angular/forms';

@Directive({
    selector: '[appNumberInputMask]'
})
export class NumberInputMaskDirective implements OnInit {

    constructor(private _elementRef: ElementRef, private _model: NgModel,
        private _control: NgControl) {
    }

    ngOnInit(): void {
    }
    value = "";
    @HostListener('keypress', ['$event'])
    onkeypress(event: any) {
        var character = String.fromCharCode(event.keyCode)
        this.value = this.value + character;
        // console.log("*** " + this.value);
        if (this.hasDecimalPlace(this.value, 3)) {
            event.preventDefault();                 //preventing more than two digits after decimal point
            this.value = this.value.substring(0, this.value.length - 1);            
            return;
        }
        if (event.keyCode != 46) {  //allowing decimal point(.)
            if (event.keyCode == 69 || event.keyCode == 101 || ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105))) {
                this.value = this.value.substring(0, this.value.length - 1);
                event.preventDefault();
            }
        }
    }

    hasDecimalPlace(value, x) {
        var pointIndex = value.indexOf('.');
        return pointIndex >= 0 && pointIndex < value.length - x;
    }

    @HostListener('keydown', ['$event'])
    onkeydown(event: any) {
        // console.log("@@@ "+event.keyCode);
        if (event.keyCode == 8) {
            this.value = this.value.substring(0, this.value.length - 1);
        }
        if(event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39) {
            event.preventDefault();
        }
        // console.log("&&& " + this.value);
    }

}
