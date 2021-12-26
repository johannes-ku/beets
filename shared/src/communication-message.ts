import { PlayerState, TrackSource } from './player-state';

export enum CommunicationMessageType {
  Play = 'Play',
  Pause = 'Pause',
  Next = 'Next',
  IdentifyAsPlayer = 'IdentifyAsPlayer',
  IdentifyAsUser = 'IdentifyAsUser',
  PlayerState = 'PlayerState',
  AddTrack = 'AddTrack'
}

export type CommunicationMessage =
    CommunicationMessagePlay |
    CommunicationMessagePause |
    CommunicationMessageNext |
    CommunicationMessageIdentifyAsPlayer |
    CommunicationMessageIdentifyAsUser |
    CommunicationMessagePlayerState |
    CommunicationMessageAddTrack;

export interface CommunicationMessagePlay {
  readonly type: CommunicationMessageType.Play;
}

export function createCommunicationMessagePlay(): CommunicationMessagePlay {
  return {
    type: CommunicationMessageType.Play,
  };
}

export interface CommunicationMessagePause {
  readonly type: CommunicationMessageType.Pause;
}

export function createCommunicationMessagePause(): CommunicationMessagePause {
  return {
    type: CommunicationMessageType.Pause,
  };
}

export interface CommunicationMessageNext {
  readonly type: CommunicationMessageType.Next;
}

export function createCommunicationMessageNext(): CommunicationMessageNext {
  return {
    type: CommunicationMessageType.Next,
  };
}

export interface CommunicationMessageIdentifyAsPlayer {
  readonly type: CommunicationMessageType.IdentifyAsPlayer;
}

export function createCommunicationMessageIdentifyAsPlayer(): CommunicationMessageIdentifyAsPlayer {
  return {
    type: CommunicationMessageType.IdentifyAsPlayer,
  };
}

export interface CommunicationMessageIdentifyAsUser {
  readonly type: CommunicationMessageType.IdentifyAsUser;
  readonly name: string;
}

export function createCommunicationMessageIdentifyAsUser(name: string): CommunicationMessageIdentifyAsUser {
  return {
    type: CommunicationMessageType.IdentifyAsUser,
    name,
  };
}

export interface CommunicationMessagePlayerState {
  readonly type: CommunicationMessageType.PlayerState;
  readonly state: PlayerState;
}

export function createCommunicationMessagePlayerState(state: PlayerState): CommunicationMessagePlayerState {
  return {
    type: CommunicationMessageType.PlayerState,
    state,
  };
}

export interface CommunicationMessageAddTrack {
  readonly type: CommunicationMessageType.AddTrack;
  readonly source: TrackSource;
  readonly code: string;
}

export function createCommunicationMessageAddTrack(source: TrackSource, code: string): CommunicationMessageAddTrack {
  return {
    type: CommunicationMessageType.AddTrack,
    source,
    code
  };
}


