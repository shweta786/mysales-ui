import { Component } from '@angular/core';

@Component({
  selector: 'spinny',
  styleUrls: ['./spinny.component.less'],
  templateUrl: "./spinny.component.html"
})
export class SpinnyComponent {
  public message: string = null;
  public showIcon: boolean = true;
  constructor() {}
}
