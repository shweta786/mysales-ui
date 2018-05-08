import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-version',
  template: '<div>Version: {{version}}</div>',
  styleUrls: ['./version.component.less']
})
export class VersionComponent implements OnInit {

  version: string;

  constructor() { }

  ngOnInit() {
    this.version = environment.version;
  }

}
