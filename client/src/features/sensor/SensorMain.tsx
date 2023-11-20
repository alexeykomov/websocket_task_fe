import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../App/hooks';
import { addSensorData, setProgress } from './sensorSlice';
import styles from './SensorMain.module.css';
import { Toolbar } from './Toolbar/Toolbar';
import { ConnectMessage, DataMessage } from './sensorTypes';
import {
  ConnectCommand,
  ConnectionState,
  MAX_RETRIES,
} from './sensorConstants';
import SensorTable from './SensorTable/SensorTable';
import { SensorDataList } from './SensorDataList/SensorDataList';
import { useSmallScreenLayout } from '../../hooks/useSmallScreenLayout';

export function SensorMain() {
  console.log('SensorMain: ');
  const dispatch = useAppDispatch();
  const [connectionState, setConnectionState] = useState(
    ConnectionState.NOT_STARTED
  );
  const [retries, setRetries] = useState<number>(0);
  const smallScreenLayout = useSmallScreenLayout();
  const handledIds = useRef(new Map<string, boolean>());
  const socket = useRef<WebSocket | null>(null);
  const doRequest = useRef<(message: ConnectMessage) => void>(() => {
    console.log('Not implemented.');
  });

  useEffect(() => {
    console.log('connectionState: ', connectionState, retries);
    if (
      [ConnectionState.SUCCESS, ConnectionState.PROGRESS].includes(
        connectionState
      ) ||
      retries > MAX_RETRIES
    ) {
      return;
    }
    socket.current = new WebSocket('ws://localhost:5001');

    socket.current.onopen = () => {
      console.log('WebSocket connection opened');
      setConnectionState(ConnectionState.SUCCESS);
    };

    socket.current.onerror = () => {
      console.error('WebSocket connection failed');
      setConnectionState(ConnectionState.FAILURE);
      setRetries((prev: number) => prev + 1);
    };

    socket.current.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      const data = JSON.parse(event.data) as DataMessage;
      dispatch(addSensorData(data));
      if (
        handledIds.current.has(data.id) &&
        data.connected !== handledIds.current.get(data.id)!
      ) {
        dispatch(setProgress({ id: data.id, progress: false }));
        handledIds.current.delete(data.id);
      }
    };

    socket.current.onclose = () => {
      console.log('WebSocket connection closed');
      setConnectionState(ConnectionState.NOT_STARTED);
    };

    doRequest.current = (message: ConnectMessage) => {
      console.log('message: ', message);
      handledIds.current.set(
        message.id,
        message.command === ConnectCommand.Connect
      );
      dispatch(setProgress({ id: message.id, progress: true }));
      socket.current?.send(JSON.stringify(message));
    };
    switch (connectionState) {
      case ConnectionState.NOT_STARTED:
        setConnectionState(ConnectionState.PROGRESS);
        break;
      case ConnectionState.FAILURE:
        setConnectionState(ConnectionState.PROGRESS);
        break;
    }
    return () => {
      if (connectionState === ConnectionState.FAILURE) {
        handledIds.current.clear();
        socket.current?.close();
      }
    };
  }, [dispatch, connectionState, retries]);

  useEffect(() => {
    return () => {
      if (connectionState !== ConnectionState.NOT_STARTED) {
        socket.current?.close();
      }
    };
  }, []);

  return (
    <>
      <Toolbar />
      <div className={styles.root}>
        {smallScreenLayout ? (
          <SensorDataList doRequest={doRequest.current} />
        ) : (
          <SensorTable doRequest={doRequest.current} />
        )}
      </div>
    </>
  );
}
