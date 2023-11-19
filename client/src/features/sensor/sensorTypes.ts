import { ConnectCommand } from './sensorConstants';

export type ConnectMessage = { command: ConnectCommand; id: string };

export type DataMessage = {
  id: string;
  name: string;
  connected: boolean;
  unit: string;
  value: string | null;
};

export type SetProgressActionPayload = {
  id: string;
  progress: boolean;
}
