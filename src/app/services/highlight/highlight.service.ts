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
  addOne(highlight: Highlight): Observable<any> {
    const formData = new FormData();
    const _highlight = {
      id: highlight.id,
      name: highlight.name,
      description: highlight.description,
      landId: highlight.landId,
    };

    formData.append("bild", new Blob([highlight.bild], {
      type: "application/multipart/form-data",
    }));

    formData.append(
      "highlight",
      new Blob([JSON.stringify(_highlight)], {
        type: "application/json",
      })
    );

    return this.httpClient.post<FormData>(this.HIGHLIGHT_URL, formData);
  }

  // PUT
  updateOne(highlight: Highlight): Observable<Highlight> {
    return this.httpClient.put<Highlight>(this.HIGHLIGHT_URL, highlight, {
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
