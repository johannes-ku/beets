import { Injectable } from '@angular/core';
import { CommunicationMessage, createCommunicationMessageIdentifyAsUser } from 'beets-shared';
import { BufferedSubject } from '../util/buffered-subject';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private readonly url = 'ws://local.beets:4300'; // TODO: config
  private out$ = new BufferedSubject<CommunicationMessage>();
  private socket: WebSocket;
  private identityMessage: CommunicationMessage;

  constructor() {
  }

  setIdentityAsUser(name: string) {
    this.identityMessage = createCommunicationMessageIdentifyAsUser(name);
  }

  private connect() {
    if (this.socket != null) {
      if ([WebSocket.CONNECTING, WebSocket.OPEN].includes(this.socket.readyState)) {
        return;
      }
    }
    if (this.identityMessage == null) {
      throw new Error('Identity not set');
    }
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener('open', () => {
      this.send(this.identityMessage);
      this.out$.subscribe({
        next: (message: CommunicationMessage) => this.send(message)
      });
    });
    this.socket.addEventListener('close', () => {
      this.send(this.identityMessage);
      this.out$.subscribe({
        next: (message: CommunicationMessage) => this.send(message)
      });
    });
  }



  send(message: CommunicationMessage) {
    this.connect();
    this.out$.next(message);
    console.log('Send message', message);
  }

}
