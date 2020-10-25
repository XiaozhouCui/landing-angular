import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

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
      // switchMap will hijack the value emitted from original observable (getCurrentLocation), then return a new observable (http.get) and forget all previous values in the pipe
      switchMap((params) => this.http.get(this.url, { params: params }))
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
