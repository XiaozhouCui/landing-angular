import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsService, Command } from '../notifications.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css'],
})
export class NotificationListComponent implements OnInit {
  // declare messages here so we can reference it from template
  messages: Observable<Command[]>; // an observable that will emit an array of Command objects

  constructor(private notificationsService: NotificationsService) {
    this.messages = this.notificationsService.messagesOutput;

    // // TEST MESSAGES IN TEMPLATE
    // setInterval(() => {
    //   this.notificationsService.addSuccess('IT IS WORKING!!!');
    // }, 2000);
  }

  clearMessage(id: number) {
    this.notificationsService.clearMessage(id);
  }

  ngOnInit(): void {}
}
