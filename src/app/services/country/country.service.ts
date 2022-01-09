import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Server } from 'src/app/variables/server';
import { Country } from 'src/app/models/country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  // API for countries
  readonly COUNTRY_URL: string = `${Server.API_URL}/laender`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) { }

  // GET ONE
  getOne(id: string): Observable<Country> {
    const countrytoberead_url = `${this.COUNTRY_URL}/${id}`;
    return this.httpClient.get<Country>(countrytoberead_url);
  }

  // GET ALL
  getAll(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.COUNTRY_URL);
  }

  // POST
  addOne(formData: FormData): Observable<Country> {
    return this.httpClient.post<Country>(this.COUNTRY_URL, formData);
  }

  // PUT
  updateOne(formData: FormData): Observable<Country> {
    return this.httpClient.put<Country>(this.COUNTRY_URL, formData, {
      headers: this.headers,
    });
  }

  // DELETE
  deleteOne(id: string) {
    const countrytobedeleted_url = `${this.COUNTRY_URL}/${id}`;
    return this.httpClient.delete(countrytobedeleted_url, {
      responseType: "text",
    });
  }
}
