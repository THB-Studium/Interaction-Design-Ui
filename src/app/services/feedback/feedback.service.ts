import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Server } from 'src/app/variables/server';
import { Feedback } from 'src/app/models/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  // API for feedbacks
  readonly FEEDBACK_URL: string = `${Server.API_URL}/feedbacks`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) { }

  // GET ONE
  getOne(id: string): Observable<Feedback> {
    const feedbacktoberead_url = `${this.FEEDBACK_URL}/${id}`;
    return this.httpClient.get<Feedback>(feedbacktoberead_url);
  }

  // GET ALL
  getAll(): Observable<Feedback[]> {
    return this.httpClient.get<Feedback[]>(this.FEEDBACK_URL);
  }

  // POST
  addOne(feedback: any): Observable<any> {
    return this.httpClient.post<Feedback>(this.FEEDBACK_URL, feedback);
  }

  // PUT
  updateOne(feedback: Feedback): Observable<Feedback> {
    return this.httpClient.put<Feedback>(this.FEEDBACK_URL, feedback, {
      headers: this.headers,
    });
  }

  // DELETE
  deleteOne(id: string) {
    const feedbacktobedeleted_url = `${this.FEEDBACK_URL}/${id}`;
    return this.httpClient.delete(feedbacktobedeleted_url, {
      responseType: "text",
    });
  }
}
