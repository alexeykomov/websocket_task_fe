import React from 'react';
import styles from './SensorTable.module.css';
import { ConnectMessage } from '../sensorTypes';
import { useAppSelector } from '../../../App/hooks';
import { selectSensors } from '../sensorSlice';
import { SensorTableRow } from './SensorTableRow/SensorTableRow';
import { shallowEqual } from 'react-redux';

type SensorTableProps = {
  doRequest: (message: ConnectMessage) => void
}

export const SensorTable = ({ doRequest }: SensorTableProps) => {
  const sensorIds = useAppSelector(selectSensors, shallowEqual)
  return (
    <div className={styles['sensor-table-container']}>
      <table className={styles['sensor-table']}>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Value</th>
          <th>Connected</th>
        </tr>
        </thead>
        <tbody>
        {sensorIds.map((id, index) => (
          <SensorTableRow id={id} index={index} doRequest={doRequest} key={id}/>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default SensorTable;
