import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, pluck, filter } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

interface OpenWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      tem: number;
    };
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast';
  constructor(private http: HttpClient) {}

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
      // mergeMap is similar to switchMap, but will keep all returned observables
      mergeMap((value) => of(...value)), // "of" is an observable, it will take in every array element as args and emit them one by one
      // use "filter" to pick 1 element from every 8 resultes in the array
      filter((value, index) => index % 8 === 0)
    );
  }

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
