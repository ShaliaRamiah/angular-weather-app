import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { WeatherData } from '../models/weather.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'angular-weather-app';

  coordinates!: string;
  public temperature = 0;
  public minTemp = 0;
  public maxTemp = 0;
  public city = '';

  public getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.showPosition(position);
      });
    } else {
      this.coordinates = "Geolocation is not supported by this browser.";
    }
  }

  showPosition(position: GeolocationPosition): void {
    this.coordinates = `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;

    const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`;
    this.http.get<any>(geoUrl).subscribe(geoRes => {
      this.city = geoRes.address.city || geoRes.address.town || geoRes.address.village || 'Unknown Location';
    });

    this.getData(position.coords.latitude, position.coords.longitude).subscribe(
      (res: WeatherData) => {
        const currentHour = new Date().getHours();
        this.temperature = Math.round(res.hourly.apparent_temperature[currentHour]);
        this.minTemp = Math.round(res.daily.temperature_2m_min[0]);
        this.maxTemp = Math.round(res.daily.temperature_2m_max[0]);
      });
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getLocation();
  }

  public getData(latitude: number, longitude: number): Observable<WeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature&daily=temperature_2m_min,temperature_2m_max&timezone=auto`;
    return this.http.get<WeatherData>(url).pipe(map(res => res));
  }
}
