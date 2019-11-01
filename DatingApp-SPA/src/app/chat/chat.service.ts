import { Injectable } from '@angular/core';
import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';
import { BehaviorSubject } from 'rxjs';
import { ChatBotMessage } from './_models/chat-bot-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  readonly token = 'a2ef600d1b0542d68f42e7eb45475f19';
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<ChatBotMessage[]>([]);
  constructor() { }

  public  converse(msg: string) {
    const userMessage = new ChatBotMessage(msg, 'user');
    this.update(userMessage);
    return this.client.textRequest(msg)
               .then(res => {
                const speech = res.result.fulfillment.speech;
                const botMessage = new ChatBotMessage(speech, 'bot');
                this.update(botMessage);
               });
  }

  update(msg: any) {
    this.conversation.next([msg]);
  }
}
