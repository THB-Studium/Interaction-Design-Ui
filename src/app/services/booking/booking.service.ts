import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import * as saveAs from 'file-saver';
import { Server } from 'src/app/variables/server';
import { Booking, BookingUpdate } from 'src/app/models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  // API for booking
  readonly BOOKING_URL: string = `${Server.API_URL}/buchungs`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) { }

  // GET ONE
  getOne(id: string): Observable<Booking> {
    const bookingtoberead_url = `${this.BOOKING_URL}/${id}`;
    return this.httpClient.get<Booking>(bookingtoberead_url);
  }

  // GET ALL
  getAll(): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(this.BOOKING_URL);
  }

  // POST
  addOne(booking: Booking): Observable<Booking> {
    return this.httpClient.post<Booking>(this.BOOKING_URL, booking);
  }

  // PUT
  updateOne(booking: BookingUpdate): Observable<Booking> {
    return this.httpClient.put<Booking>(this.BOOKING_URL, booking, {
      headers: this.headers,
    });
  }

  // DELETE
  deleteOne(id: string) {
    const bookingtobedeleted_url = `${this.BOOKING_URL}/${id}`;
    return this.httpClient.delete(bookingtobedeleted_url, {
      responseType: "text",
    });
  }

  //get
  exportPdf(id: string) :void{
    let headers = new HttpHeaders({ "Accept": "application/pdf" });
    this.httpClient.get(`${this.BOOKING_URL}/exportPdf/${id}`, {
      responseType: 'blob',
      headers: headers,
    }).subscribe(blob => {
      const currentDate = new Date();
      saveAs(blob, 'Buchung_'+currentDate.getTime()+'.pdf');
    });
  }
}
