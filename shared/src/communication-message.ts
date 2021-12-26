export enum CommunicationMessageType {
  Play = 'Play',
  Pause = 'Pause',
  IdentifyAsPlayer = 'IdentifyAsPlayer',
  IdentifyAsUser = 'IdentifyAsUser',
}

export type CommunicationMessage =
    CommunicationMessagePlay |
    CommunicationMessagePause |
    CommunicationMessageIdentifyAsPlayer |
    CommunicationMessageIdentifyAsUser;

export interface CommunicationMessagePlay {
  type: CommunicationMessageType.Play;
}

export function createCommunicationMessagePlay(): CommunicationMessagePlay {
  return {
    type: CommunicationMessageType.Play,
  };
}

export interface CommunicationMessagePause {
  type: CommunicationMessageType.Pause;
}

export function createCommunicationMessagePause(): CommunicationMessagePause {
  return {
    type: CommunicationMessageType.Pause,
  };
}

export interface CommunicationMessageIdentifyAsPlayer {
  type: CommunicationMessageType.IdentifyAsPlayer;
}

export function createCommunicationMessageIdentifyAsPlayer(): CommunicationMessageIdentifyAsPlayer {
  return {
    type: CommunicationMessageType.IdentifyAsPlayer,
  };
}

export interface CommunicationMessageIdentifyAsUser {
  type: CommunicationMessageType.IdentifyAsUser;
  readonly name: string;
}

export function createCommunicationMessageIdentifyAsUser(name: string): CommunicationMessageIdentifyAsUser {
  return {
    type: CommunicationMessageType.IdentifyAsUser,
    name,
  };
}
