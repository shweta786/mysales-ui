import { Directive, HostListener, ElementRef, OnInit, EventEmitter, Output,Input } from '@angular/core';

  @Directive({
    selector: '[localVariable]',
    exportAs: 'localVariable'
  })
  export class LocalVariableDirective {
    @Input() localVariable:any;

    ngOnInit(): void {

      console.log(this.localVariable);
    }

  }