export enum ConnectCommand {
  Connect = 'connect',
  Disconnect = 'disconnect',
}

export enum ConnectionFilter {
  All = 'all',
  Connected = 'connected',
}

export enum ConnectionState {
  NOT_STARTED,
  PROGRESS,
  SUCCESS,
  FAILURE,
}

export const MAX_RETRIES = 3;
