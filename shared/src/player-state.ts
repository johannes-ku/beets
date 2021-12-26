export enum PlayingStateType {
  Playing = 'Playing',
  Paused = 'Paused'
}

export enum TrackSource {
  YouTube = 'YouTube'
}

export interface Track {
  id: string;
  name: string;
  length: number;
  source: TrackSource;
  code: string;
}

export function createTrack(id: string, name: string, length: number, source: TrackSource, code: string): Track {
  return {
    id,
    name,
    length,
    source,
    code
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
