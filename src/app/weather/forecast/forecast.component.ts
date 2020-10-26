import { Component, OnInit } from '@angular/core';
import { ForecastService } from '../forecast.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent implements OnInit {
  forecastData = [];

  constructor(private forecastService: ForecastService) {
    forecastService.getForecast().subscribe((forecastData) => {
      // assign resposne data to a property of class, then we can reference that data inside template
      this.forecastData = forecastData;
    });
  }

  ngOnInit(): void {}
}
