import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  constructor() {}

  getCurrentLocation() {
    return new Observable<Coordinates>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position.coords);
          observer.complete(); // no more data will be emitted
        },
        // .error() put entire observable into "Error" state, we can no longer emit event from this observable
        (err) => observer.error(err)
      );
    });
  }
}
