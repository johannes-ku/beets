import { WebSocket, WebSocketServer } from 'ws';
import {
  CommunicationMessage,
  CommunicationMessageAddTrack,
  CommunicationMessagePaused,
  CommunicationMessageType,
  createCommunicationMessagePause,
  createCommunicationMessagePlay,
  createCommunicationMessagePlayerState,
  createCommunicationMessageSetPlayerTrack,
  createPlayerState,
  createTrack,
  PlayingStateType,
  Track,
  TrackSource
} from 'beets-shared';
import { Subscription } from 'rxjs';
import { SocketWrapper } from './socket-wrapper';
import { nanoid } from 'nanoid';
import { google, youtube_v3 } from 'googleapis';
import { duration } from 'moment';

export class Server {

  private readonly server: WebSocketServer;
  private readonly userSockets: Set<SocketWrapper> = new Set<SocketWrapper>();
  private readonly youtubeApi: youtube_v3.Youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyATchqdMwCq_oqoUVjo_05iu5HaEH5f-hA' // TODO config
  });

  private state = createPlayerState(
      PlayingStateType.Playing,
      0,
      100,
      undefined,
      []
  );

  private playerSocket: SocketWrapper;
  private playerTimeUpdatingIntervalId: any;

  constructor(port: number) {
    this.server = new WebSocketServer({
      port: port
    });
    this.server.on('listening', () => console.log(`Server listening on port ${port}`));
    this.server.on('connection', (_socket: WebSocket) => {
      const socket = new SocketWrapper(_socket);
      // @ts-ignore
      const expectIdentificationMessageSubscription: Subscription = socket.subscribe({
        next: (message: CommunicationMessage) => {
          switch (message.type) {
            case CommunicationMessageType.IdentifyAsPlayer:
              socket.name = 'PLAYER';
              this.setPlayerSocket(socket);
              break;
            case CommunicationMessageType.IdentifyAsUser:
              socket.name = message.name;
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
    if (this.state.playingStateType == PlayingStateType.Paused) {
      this.playerSocket.send(createCommunicationMessagePause());
    }
    if (this.state.currentTrack != null) {
      this.playerSocket.send(createCommunicationMessageSetPlayerTrack(
          this.state.currentTrack.source,
          this.state.currentTrack.code,
          this.state.playingTime
      ));
    }
    // @ts-ignore
    socket.subscribe({
      next: (message: CommunicationMessage) => {
        switch (message.type) {
          case CommunicationMessageType.Next:
            this.handleNext();
            break;
          case CommunicationMessageType.Playing:
            this.handlePlaying();
            break;
          case CommunicationMessageType.Paused:
            this.handlePaused(message);
            break;
          default:
            socket.log(`Unexpected message ${message.type}`);
        }
      },
      complete: () => {
        if (this.state.playingStateType == PlayingStateType.Playing) {
          this.state.playingStateType = PlayingStateType.PlayingButActuallyNot;
          this.stateUpdated();
        }
      }
    });
  }

  private addUserSocket(socket: SocketWrapper) {
    this.userSockets.add(socket);
    // @ts-ignore
    socket.send(createCommunicationMessagePlayerState(this.state));
    // @ts-ignore
    socket.subscribe({
      next: (message: CommunicationMessage) => {
        switch (message.type) {
          case CommunicationMessageType.Play:
            this.handlePlay();
            break;
          case CommunicationMessageType.Pause:
            this.handlePause();
            break;
          case CommunicationMessageType.Next:
            this.handleNext();
            break;
          case CommunicationMessageType.AddTrack:
            this.handleAddTrack(message, socket);
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

  private handlePlay() {
    if ([PlayingStateType.PlayingButActuallyNot, PlayingStateType.Playing].includes(this.state.playingStateType)) {
      return;
    }
    this.state.playingStateType = PlayingStateType.PlayingButActuallyNot;
    if (this.playerSocket != null) {
      this.playerSocket.send(createCommunicationMessagePlay());
    }
    this.stateUpdated();
  }

  private handlePause() {
    if (this.state.playingStateType == PlayingStateType.Paused) {
      return;
    }
    this.state.playingStateType = PlayingStateType.Paused;
    if (this.playerSocket != null) {
      this.playerSocket.send(createCommunicationMessagePause());
    }
    this.stateUpdated();
  }

  private async handleAddTrack(message: CommunicationMessageAddTrack, socket: SocketWrapper) {
    const track = await this.createYoutubeTrack(message.code, socket.name!);
    this.state.queue.push(track);
    if (this.state.currentTrack == null) {
      this.nextTrack();
    }
    this.stateUpdated();
  }

  private handleNext() {
    this.nextTrack();
  }

  private handlePlaying() {
    this.state.playingStateType = PlayingStateType.Playing;
    this.stateUpdated();
  }

  private handlePaused(message: CommunicationMessagePaused) {
    this.state.playingStateType = PlayingStateType.Paused;
    this.state.playingTime = message.time;
    this.stateUpdated();
  }

  private nextTrack() {
    const nextTrack = this.state.queue.shift();
    if (nextTrack == null) {
      // TODO Somehow pause player
      return;
    }
    this.state.playingTime = 0;
    this.state.currentTrack = nextTrack;
    if (this.state.playingStateType == PlayingStateType.Playing) {
      this.state.playingStateType = PlayingStateType.PlayingButActuallyNot;
    }
    if (this.playerSocket != null) {
      this.playerSocket.send(createCommunicationMessageSetPlayerTrack(
          nextTrack.source,
          nextTrack.code,
          0,
      ));
    }
    this.stateUpdated();
  }

  private stateUpdated() {
    if (this.state.playingStateType === PlayingStateType.Playing) {
      if (this.playerTimeUpdatingIntervalId == null) {
        this.playerTimeUpdatingIntervalId = setInterval(
            () => this.state.playingTime += 1,
            1000
        );
      }
    } else {
      if (this.playerTimeUpdatingIntervalId != null) {
        clearInterval(this.playerTimeUpdatingIntervalId);
        this.playerTimeUpdatingIntervalId = null;
      }
    }

    const message = createCommunicationMessagePlayerState(this.state);
    this.userSockets.forEach((socket: SocketWrapper) => {
      socket.send(message);
    });
  }

  private async createYoutubeTrack(code: string, queuedBy: string): Promise<Track> {
    const videoInfoResponse = await this.youtubeApi.videos.list({
      id: [code],
      part: ['snippet', 'contentDetails']
    });
    const videoInfo = videoInfoResponse.data.items![0];
    const snippet = videoInfo.snippet!;
    const contentDetails = videoInfo.contentDetails!;
    if (contentDetails == null) {
      throw new Error('Content details empty');
    }
    return createTrack(
        nanoid(16),
        snippet.title!,
        duration(videoInfo.contentDetails!.duration).asSeconds(),
        TrackSource.Youtube,
        code,
        queuedBy
    );
  }

}
