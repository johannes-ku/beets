import { MessageEvent, WebSocket } from 'ws';
import { CommunicationMessage } from 'beets-shared';
import { nanoid } from 'nanoid';
import { Observable, Subject, Subscription } from 'rxjs';

export class SocketWrapper extends Observable<CommunicationMessage> {

  readonly id: string;
  private readonly subject = new Subject<CommunicationMessage>();
  private readonly messageHandler: any;
  private readonly errorHandler: any;
  private readonly closeHandler: any;

  constructor(private socket: WebSocket) {
    super(subscriber => {
      // It does actually return Subscription
      // noinspection JSVoidFunctionReturnValueUsed
      const subscription: Subscription = this.subject.subscribe(subscriber);
      return () => subscription.unsubscribe();
    });
    this.id = nanoid(8);
    this.messageHandler = (messageEvent: MessageEvent) => {
      this.subject.next(JSON.parse(messageEvent.data));
    };
    this.errorHandler = (errorEvent: any) => {
      this.subject.error(errorEvent);
    };
    this.closeHandler = () => {
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
    console.log(`[${this.id}] ${message}`);
  }

  send(message: CommunicationMessage) {
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
