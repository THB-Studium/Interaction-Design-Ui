import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Server } from 'src/app/variables/server';
import { TripOffer } from 'src/app/models/tripOffer';

@Injectable({
  providedIn: 'root'
})
export class TripOfferService {
  // API for tripoffers
  readonly TRIPOFFERS_URL: string = `${Server.API_URL}/reiseAngebot`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) { }

  // GET ONE
  getOne(id: string): Observable<TripOffer> {
    const tripoffertoberead_url = `${this.TRIPOFFERS_URL}/${id}`;
    return this.httpClient.get<TripOffer>(tripoffertoberead_url);
  }

  // GET ALL
  getAll(): Observable<TripOffer[]> {
    return this.httpClient.get<TripOffer[]>(this.TRIPOFFERS_URL);
  }

  // POST
  addOne(formData: any): Observable<TripOffer> {    
    return this.httpClient.post<TripOffer>(this.TRIPOFFERS_URL, formData);
  }

  // PUT
  updateOne(formData: any): Observable<TripOffer> {
    return this.httpClient.put<TripOffer>(this.TRIPOFFERS_URL, formData, {
      headers: this.headers,
    });
  }

  // DELETE
  deleteOne(id: string) {
    const tripoffertobedeleted_url = `${this.TRIPOFFERS_URL}/${id}`;
    return this.httpClient.delete(tripoffertobedeleted_url, {
      responseType: "text",
    });
  }
}
