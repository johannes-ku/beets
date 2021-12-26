import { Injectable } from '@angular/core';
import {
  CommunicationMessage,
  createCommunicationMessageIdentifyAsUser,
  createCommunicationMessageIdentifyAsPlayer
} from 'beets-shared';
import { BufferedSubject } from '../util/buffered-subject';
import { Observable, Subject, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService extends Observable<CommunicationMessage> {

  private readonly url = 'ws://local.beets:4300'; // TODO: config
  private out$ = new BufferedSubject<CommunicationMessage>();
  private socket: WebSocket;
  private identityMessage: CommunicationMessage;
  private in$ = new Subject<CommunicationMessage>();

  constructor() {
    super(subscriber => {
      const subscription = this.in$.subscribe(subscriber);
      return () => subscription.unsubscribe();
    });
  }

  setIdentityAsUser(name: string) {
    this.identityMessage = createCommunicationMessageIdentifyAsUser(name);
    this.connect();
  }

  setIdentityAsPlayer() {
    this.identityMessage = createCommunicationMessageIdentifyAsPlayer();
    this.connect();
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
    const socket = new WebSocket(this.url);
    let subscription: Subscription;
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify(this.identityMessage));
      subscription = this.out$.subscribe({
        next: (message: CommunicationMessage) => socket.send(JSON.stringify(message))
      });
    });
    socket.addEventListener('message', (messageEvent: MessageEvent) => {
      this.in$.next(JSON.parse(messageEvent.data));
    });
    socket.addEventListener('close', () => {
      if (subscription != null) {
        subscription.unsubscribe();
      }
    });
    this.socket = socket;
  }

  send(message: CommunicationMessage) {
    this.connect();
    this.out$.next(message);
    console.log('Send message', message);
  }

}
