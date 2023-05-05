import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  coordinates!: string;

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
    this.coordinates = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
  }


  
  constructor (private http:HttpClient) {}
  title = 'angular-weather-app';
  ngOnInit(): void {
    this.getData().subscribe(res => {
      console.log(res);
    })
  }

  public getData(): Observable<any[]> {
    const longitude = 0;
    const latitude = 0;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
    return this.http.get<any[]>(url)
      .pipe(map(res => res))
  }

}

