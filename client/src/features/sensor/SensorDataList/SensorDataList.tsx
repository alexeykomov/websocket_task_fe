import React from 'react';
import { shallowEqual } from 'react-redux';
import styles from './SensorDataList.module.css';
import { selectSensors } from '../sensorSlice';
import { SensorDataItem } from './SensorDataItem/SensorDataItem';
import { useAppSelector } from '../../../App/hooks';
import { ConnectMessage } from '../sensorTypes'; // Adjust the import path as needed

type SensorDataListProps = {
  doRequest: (message: ConnectMessage) => void;
};

export const SensorDataList = ({ doRequest }: SensorDataListProps) => {
  const sensorIds = useAppSelector(selectSensors, shallowEqual);

  return (
    <div className={styles['sensor-table-container']}>
      {sensorIds.map((id, index) => (
        <SensorDataItem id={id} index={index} doRequest={doRequest} key={id} />
      ))}
    </div>
  );
};
