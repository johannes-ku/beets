export enum PlayerCommandType {
  Play = 'Play',
  Pause = 'Pause',
  SetTrackYoutube = 'SetTrackYoutube'
}

export type PlayerCommand =
    PlayerCommandPlay |
    PlayerCommandPause |
    PlayerCommandSetTrackYoutube;

export interface PlayerCommandPlay {
  type: PlayerCommandType.Play;
}

export function createPlayerCommandPlay(): PlayerCommandPlay {
  return {
    type: PlayerCommandType.Play,
  };
}

export interface PlayerCommandPause {
  type: PlayerCommandType.Pause;
}

export function createPlayerCommandPause(): PlayerCommandPause {
  return {
    type: PlayerCommandType.Pause,
  };
}

export interface PlayerCommandSetTrackYoutube {
  type: PlayerCommandType.SetTrackYoutube;
  code: string;
}

export function createPlayerCommandSetTrackYoutube(code: string): PlayerCommandSetTrackYoutube {
  return {
    type: PlayerCommandType.SetTrackYoutube,
    code
  };
}


