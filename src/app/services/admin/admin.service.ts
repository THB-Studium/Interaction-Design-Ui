import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Server } from "../../variables/server";
import { User } from "src/app/models/user";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  // API for admins
  readonly ADMIN_URL: string = `${Server.API_URL}/admins`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) {}

  // GET ONE
  getOne(id: string): Observable<User> {
    const admintoberead_url = `${this.ADMIN_URL}/${id}`;
    return this.httpClient.get<User>(admintoberead_url);
  }

  // GET ALL
  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.ADMIN_URL);
  }

  // POST
  addOne(admin: User): Observable<User> {
    return this.httpClient.post<User>(this.ADMIN_URL, admin);
  }

  // PUT
  updateOne(admin: User): Observable<User> {
    return this.httpClient.put<User>(this.ADMIN_URL, admin, {
      headers: this.headers,
    });
  }

  // DELETE
  deleteOne(id: string) {
    const admintobedeleted_url = `${this.ADMIN_URL}/${id}`;
    return this.httpClient.delete(admintobedeleted_url, {
      responseType: "text",
    });
  }
}
