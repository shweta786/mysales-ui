import { Component, ViewContainerRef } from '@angular/core';
import { SpinnyService } from './shared/spinny/spinny.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private spinnyService: SpinnyService, private vcRef: ViewContainerRef) {
    spinnyService.defaultViewContainer = vcRef;
}
}
