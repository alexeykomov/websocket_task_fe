import React from 'react';
import { Header } from '../components/Header/Header';
import { useSmallScreenLayout } from '../hooks/useSmallScreenLayout';
import styles from './App.module.css';
import { SensorMain } from '../features/sensor/SensorMain';

function App() {
  const smallScreenLayout = useSmallScreenLayout();

  return (
    <div className={styles.app} data-testid="app">
      <Header fixed={smallScreenLayout} />
      <SensorMain />
    </div>
  );
}

export default App;
