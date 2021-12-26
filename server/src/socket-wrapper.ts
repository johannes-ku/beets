import { MessageEvent, WebSocket } from 'ws';
import { CommunicationMessage } from 'beets-shared';
import { nanoid } from 'nanoid';
import { Observable, Subject, Subscription } from 'rxjs';
import * as chalk from 'chalk/index';

export class SocketWrapper extends Observable<CommunicationMessage> {

  readonly id: string;
  private readonly subject = new Subject<CommunicationMessage>();
  private readonly messageHandler: any;
  private readonly errorHandler: any;
  private readonly closeHandler: any;

  name?: string;

  constructor(private socket: WebSocket) {
    super(subscriber => {
      // It does actually return Subscription
      // noinspection JSVoidFunctionReturnValueUsed
      const subscription: Subscription = this.subject.subscribe(subscriber);
      return () => subscription.unsubscribe();
    });
    this.id = nanoid(8);
    this.log('Connected');
    this.messageHandler = (messageEvent: MessageEvent) => {
      let message: CommunicationMessage = JSON.parse(messageEvent.data);
      this.log(`> ${message.type}`)
      this.subject.next(message);
    };
    this.errorHandler = (errorEvent: any) => {
      this.log(`> ERROR ${errorEvent}`)
      this.subject.error(errorEvent);
    };
    this.closeHandler = () => {
      this.log(`Connection closed`)
      this.subject.complete();
      this.handleClose();
    };
    socket.addEventListener('message', this.messageHandler);
    socket.addEventListener('error', this.errorHandler);
    socket.addEventListener('close', this.closeHandler);
  }

  get closed() {
    return [WebSocket.CLOSING, WebSocket.CLOSED].includes(this.socket.readyState);
  }

  log(message: string) {
    const sourceName = this.name == null ? this.id  : `${this.id}: ${this.name}`
    console.log(`[${chalk.bold(sourceName)}] ${message}`);
  }

  send(message: CommunicationMessage) {
    this.log(`< ${message.type}`)
    this.socket.send(JSON.stringify(message));
  }

  close() {
    if (this.closed) {
      return;
    }
    this.socket.close();
  }

  private handleClose() {
    this.socket.removeEventListener('message', this.messageHandler, false);
    this.socket.removeEventListener('error', this.errorHandler, false);
    this.socket.removeEventListener('close', this.closeHandler, false);
  }

}
