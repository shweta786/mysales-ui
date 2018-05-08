import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { TopNavComponent } from '../shared/topnav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  @ViewChild(TopNavComponent) topNavBar: TopNavComponent

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  get currentUser() {
    let user = this.userService.getCurrentUser();
    return user;
  }

  // linkClicked(){
  //   this.topNavBar.toggleSideNavBar();
  // }
}
