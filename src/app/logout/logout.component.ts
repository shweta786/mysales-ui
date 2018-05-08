import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.less']
})
export class LogoutComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {

  }

  logoutUser() {
    this.userService.logout()
      .subscribe((result) => {
        this.userService.currentUser = null;
        localStorage.removeItem('user');
        localStorage.removeItem('currentClientId');
            this.router.navigateByUrl('/login');
    });
  }
}
