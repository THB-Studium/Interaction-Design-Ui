import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Server } from "src/app/variables/server";
import { Highlight } from "src/app/models/highlight";

@Injectable({
  providedIn: "root",
})
export class HighlightService {
  // API for country highlights
  readonly HIGHLIGHT_URL: string = `${Server.API_URL}/highlights`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) {}

  // GET ONE
  getOne(id: string): Observable<Highlight> {
    const highlighttoberead_url = `${this.HIGHLIGHT_URL}/${id}`;
    return this.httpClient.get<Highlight>(highlighttoberead_url);
  }

  // GET ALL
  getAll(): Observable<Highlight[]> {
    return this.httpClient.get<Highlight[]>(this.HIGHLIGHT_URL);
  }

  // POST
  addOne(form: any): Observable<any> {
    return this.httpClient.post<FormData>(this.HIGHLIGHT_URL, form);
  }

  // PUT
  updateOne(form: any): Observable<Highlight> {
    return this.httpClient.put<Highlight>(this.HIGHLIGHT_URL, form, {
      headers: this.headers,
    });
  }

  // DELETE
  deleteOne(id: string) {
    const highlighttobedeleted_url = `${this.HIGHLIGHT_URL}/${id}`;
    return this.httpClient.delete(highlighttobedeleted_url, {
      responseType: "text",
    });
  }
}
