import { Component, OnInit, Input, ElementRef, EventEmitter, Output } from '@angular/core';
import { User } from '../model/user.model';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.less'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class TopNavComponent implements OnInit {
  @Input() currentUser: User;
  @Output() linkClicked: EventEmitter<any> = new EventEmitter();

  constructor(private _elementRef: ElementRef) { }

  ngOnInit() {
    //this.openClientList();
  }

  openClientList() {
    //let rightMenu = document.getElementById('rightMenu');
    //let parent = rightMenu.parentElement;
    // if (rightMenu.classList.contains('rightMenu')) {
    //   rightMenu.parentElement.style.right = '-25rem';
    // }
    // else {
    //   rightMenu.parentElement.style.right = '0rem';
    // }
    //parent.classList.toggle('site-header-expanded');
    //rightMenu.classList.toggle('rightMenu');

  }

  // toggleSideNavBar() {
  //   let sideMenu = document.getElementById('side-menu');
  //   sideMenu.classList.toggle('active-side-menu');
  // }

  clientChanged(hasClientChanged: boolean) {
    if (hasClientChanged)
      this.openClientList();
  }


  onLinkClick(){
    this.linkClicked.emit();
  }

  onClick(event) {
    
    // let parentElementId = event.target.getAttribute('id');

    // if (event.target.parentElement !== null) {
    //   parentElementId = event.target.parentElement.getAttribute('id') || event.target.getAttribute('id');
    // }

    //let rightMenu = document.getElementById('rightMenu');
    //let sideMenu = document.getElementById('side-menu');
    //let element = document.getElementById('footerHamBurger');
    //let ulElement = document.getElementById('footerUl');

    //if (!parentElementId) {
     // sideMenu.classList.remove('active-side-menu');
     // rightMenu.classList.remove('rightMenu');
      //rightMenu.parentElement.classList.remove('site-header-expanded');

     // return;
    //}

    //if (parentElementId !== 'hamBurger') // or some similar check
    //{
     // sideMenu.classList.remove('active-side-menu');
    //}

    //if (!parentElementId || (parentElementId !== 'clientList' && parentElementId !== 'rightHamBurger')) {
      //rightMenu.parentElement.style.right = '-25rem';
      //rightMenu.classList.remove('rightMenu');
    //}

    //if (parentElementId !== 'footerHamBurger' && parentElementId !== 'cd-nav' && element && ulElement) {
     // element.classList.remove('menu-is-open');
      //ulElement.classList.remove('is-visible');
    //}
  }


}