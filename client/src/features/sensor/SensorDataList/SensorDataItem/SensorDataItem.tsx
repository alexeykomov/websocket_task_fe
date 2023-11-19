import React from 'react';
import styles from './SensorDataItem.module.css';
import { useAppSelector } from '../../../../App/hooks';
import { selectSensorData } from '../../sensorSlice';
import { shallowEqual } from 'react-redux';
import { Switch } from '../../SensorTable/SensorTableRow/Switch/Switch';
import { ConnectMessage } from '../../sensorTypes'; // Adjust the import path as needed

type SensorDataItemProps = {
  index: number;
  id: string;
  doRequest: (message: ConnectMessage) => void;
};

export const SensorDataItem = ({
  id,
  index,
  doRequest,
}: SensorDataItemProps) => {
  const sensorData = useAppSelector(selectSensorData(id), shallowEqual);

  return (
    <dl key={id} className={styles['sensor-table']}>
      <div>
        <dt>ID</dt>
        <dd>{id}</dd>
      </div>
      <div>
        <dt>Name</dt>
        <dd>{sensorData.name}</dd>
      </div>
      <div>
        <dt>Value</dt>
        <dd>
          {sensorData.value === null
            ? '-'
            : `${sensorData.value} ${sensorData.unit}`}
        </dd>
      </div>
      <div>
        <dt>Connected</dt>
        <dd>
          <Switch
            id={id}
            doRequest={doRequest}
            connected={sensorData.connected}
            progress={sensorData.progress}
          />
        </dd>
      </div>
    </dl>
  );
};
