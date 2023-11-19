import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../App/hooks';
import { addSensorData, setProgress } from './sensorSlice';
import styles from './TaskList.module.css';
import { Toolbar } from './Toolbar/Toolbar';
import { ConnectMessage, DataMessage } from './sensorTypes';
import {
  ConnectCommand,
  ConnectionState,
  MAX_RETRIES,
} from './sensorConstants';
import SensorTable from './SensorTable/SensorTable';

export function SensorMain() {
  console.log('SensorMain: ');
  const dispatch = useAppDispatch();
  const [connectionState, setConnectionState] = useState(
    ConnectionState.NOT_STARTED
  );
  const [retries, setRetries] = useState(0);
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
      setRetries((prev) => prev + 1);
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
        <SensorTable doRequest={doRequest.current} />
      </div>
    </>
  );
}
