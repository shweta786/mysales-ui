import { Component, OnInit,OnDestroy, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { UserService } from '../../services/user.service';
import { Client } from '../model/client.model';
import { Observable } from 'rxjs';
import { Broadcaster } from '../broadcast.service';
import * as _ from 'lodash';
import { Router } from "@angular/router";

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.less']
})
export class ClientListComponent implements OnInit,OnDestroy {
  clients: Client[];
  @Output() clientChanged: EventEmitter<any> = new EventEmitter();

  selectedClient: number;
  isFirstLoad: boolean;
  clientMessage ;

  constructor(private clientService: ClientService,
    private userService: UserService,
    private broadcaster: Broadcaster,
    private route: Router, ) {
    this.isFirstLoad = false;
    
    this.clientMessage =  this.clientService.clientMessage.subscribe(client => {
      if (client != null && this.clients != undefined) {
        this.selectedClient = client.id;
        this.broadcaster.broadcast('client-changed', client);
      }
    });
  }

  ngOnDestroy(): void {
    // this.clientMessage.unsubscribe();
  }

  ngOnInit() {
    this.isFirstLoad = true;

    this.clientService.getClients()
      .subscribe((clients) => {
        this.clients = clients;
        this.changed(this.clientService.currentClientId, false);
        this.isFirstLoad = false;
      });
  }

  changed(clientId, navigateToEstimates: boolean = true) {
    if (this.clients == undefined || this.clients.length == 0)
      return;

    var client;
    if (clientId != -1) {
      client = this.clients.find(cl => cl.id == clientId);
    }

    if (client == void 0)
      client = _.first(this.clients);


    //redirecting to estimate url after navigating to a dummy component
    let curUrl = this.route.url;
    if (curUrl.lastIndexOf('estimateDetails/') > 0 && navigateToEstimates) {
      this.route.navigate(['/dashboard/estimates']).then((result) => {
        if (result) {
          this.clientService.currentClient = client;
        } else {
          setTimeout(() => {
            this.selectedClient = this.clientService.currentClient.id;
          }, 100);
        }
      });
    } else {
      this.clientService.currentClient = client;
    }

    if (!this.isFirstLoad)
      this.clientChanged.emit(true);
  }

  hideDropwown() {
    if (this.route.url.includes('users') && document['isRolesTab']) {
      return false;
    }
    let urlWithoutClient = ['userprofile', 'users', 'salesorder', 'apiLog'];
    let hideDropdown = false;
    urlWithoutClient.forEach(element => {
      if (this.route.url.includes(element)) {
        hideDropdown = true;
      }
    });
    return hideDropdown;
  }
}
