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
  readonly MAILINGLIST_ATTACHMENT_URL = `${Server.API_URL}/mail/attachment`;

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

    // formData: email {}
    //           content : List<MultipartFile>

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
            }),
          ],
          { type: "application/json" }
        )
      );

      // to send a list of multipart/file to backend
      // we have to pass the file and the filename
      files.forEach(x => formData.append("content", x, x.name));
      return this.httpClient.post<any>(this.MAILINGLIST_ATTACHMENT_URL, formData);
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
