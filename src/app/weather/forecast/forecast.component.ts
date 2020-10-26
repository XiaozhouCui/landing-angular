import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ForecastService } from '../forecast.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent implements OnInit {
  // // method 1: store emitted data from forecastService, and then use data in template
  // forecastData = [];

  // method 2: use async PIPE to directly use observables in template
  forecast$: Observable<{ dateString: string; temp: number }[]>; // "$" denotes observable variables

  constructor(private forecastService: ForecastService) {
    // // method 1: assign resposne data to a property of class, then we can reference that data inside template
    // forecastService.getForecast().subscribe((forecastData) => {
    //   this.forecastData = forecastData;
    // });

    // method 2: use async PIPE to directly use the observable in template
    this.forecast$ = forecastService.getForecast();
  }

  ngOnInit(): void {}
}
