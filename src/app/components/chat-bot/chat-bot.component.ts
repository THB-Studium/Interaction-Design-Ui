import { Component, OnInit } from '@angular/core';
import { credentials } from "./core/credentials";

@Component({
    selector: 'app-chat-bot',
    templateUrl: './chat-bot.component.html',
    styleUrls: ['./chat-bot.component.css'],
    standalone: true
})
export class ChatBotComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.chatBotInit()
  }

  private chatBotInit(): void {
    const win: any = window;

    (function(d, m){

      // Kommunicate settings start:
      const chatbotSettings = {
        "appId": credentials.appId,
        "popupWidget": true,
        "automaticChatOpenOnNavigation": true,
        "oneTimeRating":true
      };

      let script = document.getElementsByTagName("script").item(0);
      if (!!script) {
        script = document.createElement("script");
      }
      script.type = credentials.scriptType;
      script.async = true;
      script.src = credentials.sourceURL;

      const head = document.getElementsByTagName("head").item(0);
      head.appendChild(script);

      win.kommunicate = m; m._globals = chatbotSettings;
    })(document, win.kommunicate || {});
  }

}
