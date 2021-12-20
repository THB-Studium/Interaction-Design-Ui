import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Server } from 'src/app/variables/server';
import { Traveler } from 'src/app/models/Traveler';

@Injectable({
  providedIn: 'root'
})
export class TravelerService {
  // API for travelers
  readonly TRAVELER_URL: string = `${Server.API_URL}/reisers`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) { }

  // GET ONE
  getOne(id: string): Observable<Traveler> {
    const traveltoberead_url = `${this.TRAVELER_URL}/${id}`;
    return this.httpClient.get<Traveler>(traveltoberead_url);
  }

  // GET ALL
  getAll(): Observable<Traveler[]> {
    return this.httpClient.get<Traveler[]>(this.TRAVELER_URL);
  }

  // POST
  addOne(traveler: Traveler): Observable<Traveler> {
    return this.httpClient.post<Traveler>(this.TRAVELER_URL, traveler);
  }

  // PUT
  updateOne(traveler: Traveler): Observable<Traveler> {
    return this.httpClient.put<Traveler>(this.TRAVELER_URL, traveler, {
      headers: this.headers,
    });
  }

  // DELETE
  deleteOne(id: string) {
    const travelertobedeleted_url = `${this.TRAVELER_URL}/${id}`;
    return this.httpClient.delete(travelertobedeleted_url, {
      responseType: "text",
    });
  }
}
