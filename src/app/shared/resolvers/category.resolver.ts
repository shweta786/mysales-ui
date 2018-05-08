import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../model/category.model';
import {ClientService} from "../../services/client.service";

@Injectable()
export class CategoryResolver implements Resolve<Category[]> {

    constructor(private categoryService: CategoryService, private clientService: ClientService) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.categoryService.getCategories(this.clientService.currentClientId);
    }
}
