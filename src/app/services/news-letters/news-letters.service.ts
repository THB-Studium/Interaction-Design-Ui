import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NewsLetters } from "src/app/models/newsLetters";
import { MailingList } from "src/app/models/mailingList";
import { Server } from "src/app/variables/server";

@Injectable({
  providedIn: "root",
})
export class NewsLettersService {
  readonly NEWSLETTERS_URL: string = `${Server.API_URL}/newsletters`;
  readonly SUBSCRIBERS_URL = `${this.NEWSLETTERS_URL}/listabonniert`;
  readonly MAILINGLIST_URL = `${Server.API_URL}/mail/simple-email`;

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
    return this.httpClient.post<NewsLetters>(this.NEWSLETTERS_URL, form);
  }

  // Get Subscribers
  GetSubscribers(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.SUBSCRIBERS_URL);
  }

  // Send mail
  SendMailToAll(form: MailingList): Observable<any> {
    // get attached files list
    const files = form.files;

    console.log(files);

    let formData = new FormData();

    if (files.length == 0) {
      formData.append(
        "mail",
        new Blob(
          [
            JSON.stringify({
              to: form.recipients,
              subject: form.subject,
              properties: { content: form.message },
            }),
          ],
          { type: "application/json" }
        )
      );
      return this.httpClient.post<any>(this.MAILINGLIST_URL, formData);
    } else {
      formData.append(
        "mail",
        new Blob(
          [
            JSON.stringify({
              to: form.recipients,
              subject: form.subject,
              properties: { content: form.message },
              files: files // HERE
            }),
          ],
          { type: "application/json" }
        )
      );
      return this.httpClient.post<any>("URL FOR MAIL WITH FILES", formData);
    }
  }

  // PUT
  updateOne(newsletters: NewsLetters): Observable<NewsLetters> {
    return this.httpClient.put<NewsLetters>(this.NEWSLETTERS_URL, newsletters, {
      headers: this.headers,
    });
  }

  // DELETE
  deleteOne(id: string) {
    const newslettertobedeleted_url = `${this.NEWSLETTERS_URL}/${id}`;
    return this.httpClient.delete(newslettertobedeleted_url, {
      responseType: "text",
    });
  }
}
