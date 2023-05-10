import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

interface WeatherData {
  hourly: {
    temperature_2m: {
      datetime: string;
      temperature: number;
      latitude: number;
      longitude: number;
    }[];
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{
  title = 'angular-weather-app';

  //declaring a string property 
  coordinates!: string;
  public temperature = 0;

  //getting user's location
  public getLocation(): void {
    //checking if the browser supports geolocation
    if (navigator.geolocation) {
      //if it is supported, get users position
      navigator.geolocation.getCurrentPosition(position => {
        this.showPosition(position);
      });
    } else { 
      //if not, display error
      this.coordinates = "Geolocation is not supported by this browser.";
    }
  }

  //show users current position

  //show users current position
  showPosition(position: GeolocationPosition): void {
    this.coordinates = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
    this.getData(position.coords.latitude, position.coords.longitude).subscribe(
      (res: WeatherData) => {
        console.log(res);
        const temperatureData = ([...res.hourly.temperature_2m.slice(0, 1)]) 
        console.log(res.hourly.temperature_2m.slice(0, 24))
        this.temperature = temperatureData[0] as any;
      });
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  public getData(latitude: number, longitude: number): Observable<WeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
    return this.http.get<WeatherData>(url).pipe(map(res => res));
  }
}