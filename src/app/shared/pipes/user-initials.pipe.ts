import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userInitials',
    pure: false,
})
export class UserInitialsPipe implements PipeTransform {
    transform(value:string ): any {
       let intials:string[]=value.split(' ');
       return intials[0].charAt(0)+intials[1].charAt(0);
    }
}
