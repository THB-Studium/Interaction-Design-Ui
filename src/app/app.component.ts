import { Component } from '@angular/core';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, ScrollToTopComponent, ChatBotComponent]
})
export class AppComponent {
  title: string = 'argon-dashboard-angular';
}
