import { Directive, HostListener, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[closeOnDocumentClick]',
    host: {
      '(document:click)': 'onClick($event)',
    },
  })

  export class ClickOutsideDocumentDirective {
    constructor(private _elementRef: ElementRef) {
    }

    ngOnInit(): void {}

    onClick(event) {
     if (!this._elementRef.nativeElement.contains(event.target)) // or some similar check
       debugger;
    }
  }