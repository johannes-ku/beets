export enum PlayingStateType {
  Playing = 'Playing',
  PlayingButActuallyNot = 'PlayingButActuallyNot',
  Paused = 'Paused'
}

export enum TrackSource {
  Youtube = 'Youtube'
}

export interface Track {
  id: string;
  name: string;
  length: number;
  source: TrackSource;
  code: string;
  queuedBy: string;
}

export function createTrack(
    id: string,
    name: string,
    length: number,
    source: TrackSource,
    code: string,
    queuedBy: string
): Track {
  return {
    id,
    name,
    length,
    source,
    code,
    queuedBy
  };
}

export interface PlayerState {
  playingStateType: PlayingStateType;
  playingTime: number;
  volume: number;
  currentTrack?: Track;
  queue: Track[];
}

export function createPlayerState(
    playingStateType: PlayingStateType,
    playingTime: number,
    volume: number,
    currentTrack: Track | undefined,
    queue: Track[]
): PlayerState {
  return {
    playingStateType,
    playingTime,
    volume,
    currentTrack,
    queue
  };
}
