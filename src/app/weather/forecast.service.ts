import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  map,
  mergeMap,
  switchMap,
  pluck,
  filter,
  toArray,
  share,
  tap,
  catchError,
  retry,
} from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationsService } from '../notifications/notifications.service';

interface OpenWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    };
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast';
  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService
  ) {}

  getForecast() {
    return this.getCurrentLocation().pipe(
      map((coords) => {
        // HttpParams convert object to url query string
        return new HttpParams()
          .set('lat', String(coords.latitude))
          .set('lon', String(coords.longitude))
          .set('units', 'metric')
          .set('appid', '6ed7aab3292b4cad763b859b79714283');
      }),
      // switchMap will hijack the value emitted from original observable (getCurrentLocation), then return a new observable (http.get) and discard all previous values in the pipe
      switchMap((params) =>
        this.http.get<OpenWeatherResponse>(this.url, { params: params })
      ),
      // all value after switchMap will be the http response emitted from new observable, forget about getCurrentLocation
      pluck('list'), // only emit the response.list (an array of 40 objects)
      // mergeMap is similar to switchMap, but will return and keep all 40 observables
      mergeMap((value) => of(...value)), // "of" returns a reconfigured observable, it will take in every array element as args and emit them one by one
      // use "filter" to pick 1 element in every 8 resultes to emit 5 weather objects
      filter((value, index) => index % 8 === 0),
      // convert the 5 huge objects into 5 smaller objects.
      map((value) => {
        return {
          dateString: value.dt_txt,
          temp: value.main.temp,
        };
      }),
      // combine the 5 separately emitted objects into an array
      toArray(),
      // Multicast: let all subscribers share the same observable pipe, no more duplicate HTTP requests!
      share()
    );
  }

  getCurrentLocation() {
    return new Observable<Coordinates>((observer) => {
      // console.log('Trying to get location...');
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position.coords); // emit a value
          observer.complete(); // no more data will be emitted
        },
        // .error() put entire observable into "Error" state, we can no longer emit values from this observable
        (err) => observer.error(err) // emit an error
      );
    }).pipe(
      retry(2),
      tap(
        // first arg of tap is called when observerable emits a value
        () => {
          this.notificationsService.addSuccess('Got your location');
        }
        // // second arg of tap is called when observerable is in error state
        // (err) => {
        //   this.notificationsService.addError('Failed to get your location');
        // }
      ),
      // catchError operator will only be invoked when source observerable emits an error
      catchError((err) => {
        // 1) Handle the error
        this.notificationsService.addError('Failed to get your location');

        // 2) Return a new observable
        return throwError(err); // EQUAVALENT: return new Observable(observer => {observer.error(err)});
      })
    );
  }
}
