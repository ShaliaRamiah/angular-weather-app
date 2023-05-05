import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'angular-weather-app';

  coordinates!: string;
  weatherData: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getLocation();
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.showPosition(position);
        console.log(position);
      });
    } else {
      this.coordinates = 'Geolocation is not supported by this browser.';
    }
  }

  showPosition(position: GeolocationPosition): void {
    this.coordinates = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
    this.getTemperature(position.coords.latitude, position.coords.longitude).subscribe(temp => {
      this.weatherData.temperature = temp;
      console.log(this.weatherData); 
    });
  }

  getTemperature(latitude: number, longitude: number): Observable<any> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
    return this.http.get<any>(url).pipe(map(res => res.hourly[0]?.temperature_2m));
  }
}
