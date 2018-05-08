import * as _ from 'lodash';

export class EstimateSelectedItemPoCategoryViewModel {
  public componentsCollection: EstimateSelectedItemPoCategoryViewModel[] = [];
  public get isLastSelectedPoCategoryOnCustomItem(): boolean {
    return this.selectedItemIsCustom && _.find(_.filter(this.componentsCollection, 
      (x) => x.poCategoryId !== this.poCategoryId), (y) => y.uiSelected) == void 0;
  }
  constructor(public poCategoryId: number, 
    public poCategory: string, 
    public isUsedOnAtLeastOneJob: boolean,
    public selectedItemIsCustom: boolean, 
    public selected: boolean, 
    public uiSelected: boolean) {}
}
