import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{
  title = 'angular-weather-app';

  //declaring a string property 
  coordinates!: string;

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
  showPosition(position: GeolocationPosition): void {
    //setting coordinates to users long and lat 
    this.coordinates = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
    this.getData(position.coords.latitude, position.coords.longitude).subscribe(res => {
      console.log(res);
    })
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  public getData(latitude: number, longitude: number): Observable<any[]> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`
    return this.http.get<any[]>(url)
      .pipe(map(res => res))
  }
}
