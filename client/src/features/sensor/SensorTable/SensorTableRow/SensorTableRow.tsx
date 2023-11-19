import React from 'react';
import { useAppSelector } from '../../../../App/hooks';
import { selectSensorData } from '../../sensorSlice';
import { ConnectMessage } from '../../sensorTypes';
import { Switch } from './Switch/Switch';
import { shallowEqual } from 'react-redux';

type SensorTableRowProps = {
  index: number;
  id: string;
  doRequest: (message: ConnectMessage) => void;
};

export const SensorTableRow = ({
  index,
  id,
  doRequest,
}: SensorTableRowProps) => {
  const sensorData = useAppSelector(selectSensorData(id), shallowEqual);
  return (
    <tr key={id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
      <td>{id}</td>
      <td>{sensorData.name}</td>
      <td>
        {sensorData.value === null
          ? '-'
          : `${sensorData.value} ${sensorData.unit}`}
      </td>
      <td>
        <Switch
          id={id}
          doRequest={doRequest}
          connected={sensorData.connected}
          progress={sensorData.progress}
        />
      </td>
    </tr>
  );
};
