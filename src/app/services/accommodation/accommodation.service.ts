import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Server } from "src/app/variables/server";
import { Accommodation } from "src/app/models/accommodation";

@Injectable({
  providedIn: "root",
})
export class AccommodationService {
  // API for accommodations
  readonly ACCOMMODATIONS_URL: string = `${Server.API_URL}/unterkunfte`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) {}

  // GET ONE
  getOne(id: string): Observable<Accommodation> {
    const accommodationtoberead_url = `${this.ACCOMMODATIONS_URL}/${id}`;
    return this.httpClient.get<Accommodation>(accommodationtoberead_url);
  }

  // GET ALL
  getAll(): Observable<Accommodation[]> {
    return this.httpClient.get<Accommodation[]>(this.ACCOMMODATIONS_URL);
  }

  // POST
  addOne(accommodation: Accommodation): Observable<Accommodation> {
    const formData = new FormData();
    const a = {
      id: accommodation.id,
      name: accommodation.name,
      beschreibung: accommodation.beschreibung,
      link: accommodation.link,
      adresse: accommodation.addresse,
      landId: accommodation.landId,
    };

    formData.append(
      "files",
      new Blob([accommodation.bilder], {
        type: "application/multipart/form-data",
      })
    );

    formData.append(
      "unterkunft",
      new Blob([JSON.stringify(a)], { type: "application/json" })
    );
    
    return this.httpClient.post<Accommodation>(
      this.ACCOMMODATIONS_URL,
      formData
    );
  }

  // PUT
  updateOne(accommodation: Accommodation): Observable<Accommodation> {
    return this.httpClient.put<Accommodation>(
      this.ACCOMMODATIONS_URL,
      accommodation,
      {
        headers: this.headers,
      }
    );
  }

  // DELETE
  deleteOne(id: string) {
    const accommodationtobedeleted_url = `${this.ACCOMMODATIONS_URL}/${id}`;
    return this.httpClient.delete(accommodationtobedeleted_url, {
      responseType: "text",
    });
  }
}
