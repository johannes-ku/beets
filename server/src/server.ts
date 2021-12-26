import { WebSocket, WebSocketServer } from 'ws';
import { CommunicationMessage, CommunicationMessageType } from 'beets-shared';
import { Subscription } from 'rxjs';
import { SocketWrapper } from './socket-wrapper';

export class Server {

  private readonly server: WebSocketServer;
  private readonly userSockets: Set<SocketWrapper> = new Set<SocketWrapper>();

  private playerSocket: SocketWrapper;

  constructor(port: number) {
    this.server = new WebSocketServer({
      port: port
    });
    this.server.on('listening', () => console.log(`Server listening on port ${port}`));
    this.server.on('connection', (_socket: WebSocket) => {
      const socket = new SocketWrapper(_socket);
      socket.log('Connected');
      socket.subscribe({
        next: (message: CommunicationMessage) => socket.log(`Message: ${message.type}`),
        error: (error: any) => socket.log(`Error: ${error}`),
        complete: () => socket.log('Connection closed')
      });
      const expectIdentificationMessageSubscription: Subscription = socket.subscribe({
        next: (message: CommunicationMessage) => {
          switch (message.type) {
            case CommunicationMessageType.IdentifyAsPlayer:
              this.setPlayerSocket(socket);
              break;
            case CommunicationMessageType.IdentifyAsUser:
              socket.log('Identified as user');
              this.addUserSocket(socket);
              break;
            default:
              socket.log(`Expected identifying message, got ${message.type} instead`);
              socket.close();
          }
          expectIdentificationMessageSubscription.unsubscribe();
        }
      });
    });
  }

  private setPlayerSocket(socket: SocketWrapper) {
    if (this.playerSocket != null) {
      this.playerSocket.close();
    }
    this.playerSocket = socket;
    // TODO: connect stuff to socket
  }


  private addUserSocket(socket: SocketWrapper) {
    this.userSockets.add(socket);
    socket.subscribe({
      next: (message: CommunicationMessage) => {
        switch (message.type) {
          case CommunicationMessageType.Play:
          case CommunicationMessageType.Pause:
            this.playerSocket.send(message);
            break;
          default:
            socket.log(`Unexpected message ${message.type}`);
        }
      },
      complete: () => {
        this.userSockets.delete(socket);
      }
    });
  }

}
