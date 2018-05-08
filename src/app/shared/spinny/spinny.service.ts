import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { SpinnyComponent } from './spinny.component';

@Injectable()
export class SpinnyService {
  private currentSpinny: any = null;
  private _message: string = null;
  private _useIcon: boolean = null;
  public defaultViewContainer: ViewContainerRef;
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public start() {
    if (this.currentSpinny === null) {
      let spinnyCompFactory = this.componentFactoryResolver.resolveComponentFactory(SpinnyComponent);
      this.currentSpinny = this.defaultViewContainer.createComponent(spinnyCompFactory);
      this.currentSpinny.message = this._message;
      this.currentSpinny.useIcon = this._useIcon;
    }
  }

  public stop() {
    if (this.currentSpinny !== null) {
      this.currentSpinny.destroy();
      this.currentSpinny = null;
    }
  }

  public get message(): string {
    return this._message;
  }
  public set message(msg: string) {
    this._message = msg;
    if (this.currentSpinny !== null) {
      this.currentSpinny.message = this._message;
    }
  }

  public get useIcon(): boolean {
    return this._useIcon;
  }
  public set useIcon(useIcn: boolean) {
    this._useIcon = useIcn;
    if (this.currentSpinny !== null) {
      this.currentSpinny.useIcon = this._useIcon;
    }
  }
}
