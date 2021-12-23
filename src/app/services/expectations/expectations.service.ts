import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Server } from 'src/app/variables/server';
import { Expectation } from 'src/app/models/expectation';

@Injectable({
  providedIn: 'root'
})
export class ExpectationsService {
  // API for country expectations
  readonly EXPECTATION_URL: string = `${Server.API_URL}/erwartungen`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) { }

  // GET ONE
  getOne(id: string): Observable<Expectation> {
    const expectationtoberead_url = `${this.EXPECTATION_URL}/${id}`;
    return this.httpClient.get<Expectation>(expectationtoberead_url);
  }

  // GET ALL
  getAll(): Observable<Expectation[]> {
    return this.httpClient.get<Expectation[]>(this.EXPECTATION_URL);
  }

  // POST
  addOne(expectation: Expectation): Observable<Expectation> {
    return this.httpClient.post<Expectation>(this.EXPECTATION_URL, expectation);
  }

  // PUT
  updateOne(expectation: Expectation): Observable<Expectation> {
    return this.httpClient.put<Expectation>(this.EXPECTATION_URL, expectation, {
      headers: this.headers,
    });
  }

  // DELETE
  deleteOne(id: string) {
    const expectationtobedeleted_url = `${this.EXPECTATION_URL}/${id}`;
    return this.httpClient.delete(expectationtobedeleted_url, {
      responseType: "text",
    });
  }
}
