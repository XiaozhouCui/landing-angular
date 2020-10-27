import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

interface Command {
  id: number;
  type: 'success' | 'error' | 'clear';
  text?: string; // text property is optional, marked by "?"
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  // Subject can get data into pipeline(chaining .next(data)), Observable can't
  messagesInput: Subject<Command>;
  // Subject will automatically become Observable after chaining a .pipe()
  // output will emit an array of Command objects
  messagesOutput: Observable<Command[]>;

  constructor() {
    this.messagesInput = new Subject<Command>();
    this.messagesOutput = this.messagesInput.pipe(
      // scan is like Array.reduce(), taking in an accumulator and current value and return processed results
      // acc is the messages array, value is the current command object thrown into this subject
      scan((acc: Command[], value: Command) => {
        if (value.type === 'clear') {
          // if a 'clear' command is thrown in, remove that command object with given ID from the messages array
          return acc.filter((command) => command.id !== value.id);
        } else {
          // if a 'success' or 'error' command is thrown in, add that command to the messages array
          return [...acc, value];
        }
      }, []) // initial value for accumulator (messages array) is an empty array
    );
  }

  addSuccess(message: string) {
    // calling .next(message) will throw a new value (command object) into the messages subject
    this.messagesInput.next({
      id: this.randomId(),
      text: message,
      type: 'success',
    });
  }

  addError(message: string) {
    this.messagesInput.next({
      id: this.randomId(),
      text: message,
      type: 'error',
    });
  }

  clearMessage(id: number) {
    this.messagesInput.next({
      id,
      type: 'clear',
    });
  }

  private randomId() {
    return Math.round(Math.random() * 10000);
  }
}
