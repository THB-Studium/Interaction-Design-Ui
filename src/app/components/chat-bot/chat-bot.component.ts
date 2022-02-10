import { Component, OnInit } from '@angular/core';
import {credentials} from "./core/credentials";

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {

  constructor() {
  }

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
        "quickReplies":["Speak with an Agent","Book a Demo","Sample Bots"],
        "oneTimeRating":true
      };

      // Kommunicate settings end:
      // const script = document.createElement("script");
      // console.log(document.getElementsByTagName('script'))
      // const script: any = {}

      const script = document.getElementsByTagName("script").item(0);
      script.type = credentials.scriptType;
      script.async = true;
      script.src = credentials.sourceURL;

      const head = document.getElementsByTagName("head").item(0);
      head.appendChild(script);

      console.log(win.kommunicate)
      console.log(head)
      console.log(m)
      console.log(d)


      win.kommunicate = m; m._globals = chatbotSettings;
    })(document, win.kommunicate || {});
  }

}
