import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsLetters } from 'src/app/models/newsLetters';
import { Server } from 'src/app/variables/server';

@Injectable({
  providedIn: 'root'
})
export class NewsLettersService {

  readonly NEWSLETTERS_URL: string = `${Server.API_URL}/newsletters`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) {}

    // GET ALL
    getAll(): Observable<NewsLetters[]> {
      return this.httpClient.get<NewsLetters[]>(this.NEWSLETTERS_URL);
    }
  
    // POST
    subscribe(form: any): Observable<NewsLetters> {
      return this.httpClient.post<NewsLetters>(
        `${this.NEWSLETTERS_URL}/subscribe`,
        form
      );
    }

    // PUT
    unsubscribe(form: any): Observable<NewsLetters> {
      return this.httpClient.post<NewsLetters>(
        this.NEWSLETTERS_URL,
        form
      );
    }

}
