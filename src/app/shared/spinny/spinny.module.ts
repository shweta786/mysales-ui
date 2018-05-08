import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnyService } from "./spinny.service";
import { SpinnyComponent } from './spinny.component';

@NgModule({
  imports: [CommonModule],
  exports: [],
  declarations: [SpinnyComponent],
  entryComponents: [SpinnyComponent], //THIS IS IMPORTANT!!!!
  providers: [SpinnyService]
})
export class SpinnyModule { }
