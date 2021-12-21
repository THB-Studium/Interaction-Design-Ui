import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Server } from 'src/app/variables/server';
import { CountryInformation } from 'src/app/models/countryInformation';

@Injectable({
  providedIn: 'root'
})
export class CountryInformationService {
  // API for country info
  readonly countryInformation_URL: string = `${Server.API_URL}/landInfos`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) { }

  // GET ONE
  getOne(id: string): Observable<CountryInformation> {
    const countryInfotoberead_url = `${this.countryInformation_URL}/${id}`;
    return this.httpClient.get<CountryInformation>(countryInfotoberead_url);
  }

  // GET ALL
  getAll(): Observable<CountryInformation[]> {
    return this.httpClient.get<CountryInformation[]>(this.countryInformation_URL);
  }

  // POST
  addOne(countryInfo: CountryInformation): Observable<CountryInformation> {
    return this.httpClient.post<CountryInformation>(this.countryInformation_URL, countryInfo);
  }

  // PUT
  updateOne(countryInfo: CountryInformation): Observable<CountryInformation> {
    return this.httpClient.put<CountryInformation>(this.countryInformation_URL, countryInfo, {
      headers: this.headers,
    });
  }

  // DELETE
  deleteOne(id: string) {
    const countryInfotobedeleted_url = `${this.countryInformation_URL}/${id}`;
    return this.httpClient.delete(countryInfotobedeleted_url, {
      responseType: "text",
    });
  }
}
