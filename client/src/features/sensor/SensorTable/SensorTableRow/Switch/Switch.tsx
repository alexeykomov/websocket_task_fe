import React from 'react';
import styles from './Switch.module.css';
import { ConnectMessage } from '../../../sensorTypes';
import { ConnectCommand } from '../../../sensorConstants';

export interface SwitchProps {
  id: string;
  connected: boolean;
  progress: boolean;
  doRequest: (message: ConnectMessage) => void;
}

export const Switch = ({ id, doRequest, connected, progress }: SwitchProps) => {
  const [inputId] = React.useState(`sensor-switch-${id}`);
  return (
    <>
      <input
        type="checkbox"
        checked={connected}
        className={styles.checkbox}
        onChange={(e) => {
          doRequest({
            id,
            command: e.target.checked
              ? ConnectCommand.Connect
              : ConnectCommand.Disconnect,
          });
        }}
        id={inputId}
      />
      <label className={styles.label} htmlFor={inputId}>
        <div className={styles.indicator} />
      </label>
    </>
  );
};
