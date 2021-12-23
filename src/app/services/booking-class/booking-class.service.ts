import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Server } from 'src/app/variables/server';
import { BookingClass } from 'src/app/models/bookingClass';

@Injectable({
  providedIn: 'root'
})
export class BookingClassService {

   // API for booking class
   readonly BOOKINGCLASS_URL: string = `${Server.API_URL}/buchungsklassen`;
   headers = new HttpHeaders({ "Content-Type": "application/json" });

   constructor(private httpClient: HttpClient) { }

   // GET ONE
   getOne(id: string): Observable<BookingClass> {
     const bookingclasstoberead_url = `${this.BOOKINGCLASS_URL}/${id}`;
     return this.httpClient.get<BookingClass>(bookingclasstoberead_url);
   }

   // GET ALL
   getAll(): Observable<BookingClass[]> {
     return this.httpClient.get<BookingClass[]>(this.BOOKINGCLASS_URL);
   }

   // POST
   addOne(bookingclass: BookingClass): Observable<BookingClass> {
     return this.httpClient.post<BookingClass>(this.BOOKINGCLASS_URL, bookingclass);
   }

   // PUT
   updateOne(bookingclass: BookingClass): Observable<BookingClass> {
     return this.httpClient.put<BookingClass>(this.BOOKINGCLASS_URL, bookingclass, {
       headers: this.headers,
     });
   }

   // DELETE
   deleteOne(id: string) {
     const bookingclasstobedeleted_url = `${this.BOOKINGCLASS_URL}/${id}`;
     return this.httpClient.delete(bookingclasstobedeleted_url, {
       responseType: "text",
     });
   }
}
