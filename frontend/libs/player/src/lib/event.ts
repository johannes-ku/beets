export enum PlayerEventType {
  Started = 'Started',
  Paused = 'Paused',
  Ended = 'Ended',
  Buffering = 'Buffering'
}

export type PlayerEvent =
    PlayerEventStarted |
    PlayerEventPaused |
    PlayerEventEnded |
    PlayerEventBuffering;

export interface PlayerEventStarted {
  readonly type: PlayerEventType.Started;
}

export function createPlayerEventStarted(): PlayerEventStarted {
  return {
    type: PlayerEventType.Started
  };
}

export interface PlayerEventPaused {
  readonly type: PlayerEventType.Paused;
  readonly time: number;
}

export function createPlayerEventPaused(time: number): PlayerEventPaused {
  return {
    type: PlayerEventType.Paused,
    time
  };
}

export interface PlayerEventEnded {
  readonly type: PlayerEventType.Ended;
}

export function createPlayerEventEnded(): PlayerEventEnded {
  return {
    type: PlayerEventType.Ended
  };
}

export interface PlayerEventBuffering {
  readonly type: PlayerEventType.Buffering;
  readonly time: number;
}

export function createPlayerEventBuffering(time: number): PlayerEventBuffering {
  return {
    type: PlayerEventType.Buffering,
    time
  };
}
