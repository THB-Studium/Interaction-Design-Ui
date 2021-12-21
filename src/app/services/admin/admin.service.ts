import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Server } from "../../variables/server";
import { Admin } from "src/app/models/admin";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  // API for admins
  readonly ADMIN_URL: string = `${Server.API_URL}/admins`;
  headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(private httpClient: HttpClient) {}

  // GET ONE
  getOneAdmin(id: string): Observable<Admin> {
    const admintoberead_url = `${this.ADMIN_URL}/${id}`;
    return this.httpClient.get<Admin>(admintoberead_url);
  }

  // GET ALL
  getAllAdmins(): Observable<Admin[]> {
    return this.httpClient.get<Admin[]>(this.ADMIN_URL);
  }

  // POST
  addAdmin(admin: Admin): Observable<Admin> {
    return this.httpClient.post<Admin>(this.ADMIN_URL, admin);
  }

  // PUT
  updateAdmin(admin: Admin): Observable<Admin> {
    return this.httpClient.put<Admin>(this.ADMIN_URL, admin, {
      headers: this.headers,
    });
  }

  // DELETE
  deleteAdmin(id: string) {
    const admintobedeleted_url = `${this.ADMIN_URL}/${id}`;
    return this.httpClient.delete(admintobedeleted_url, {
      responseType: "text",
    });
  }
}
