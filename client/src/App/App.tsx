import React from 'react';
import { Header } from '../components/Header/Header';
import {
  useMenuClosed,
  useSmallScreenLayout,
} from '../hooks/useSmallScreenLayout';
import styles from './App.module.css';
import { MenuState } from './constants';
import { SensorMain } from '../features/sensor/SensorMain';

function App() {
  const smallScreenLayout = useSmallScreenLayout();
  const menuClosed = useMenuClosed();
  const [menuState, setMenuState] = React.useState(
    menuClosed ? MenuState.Closed : MenuState.Open
  );
  const onMenuTransitionEnd = () => {
    if (menuState === MenuState.Closing) {
      setMenuState(MenuState.Closed);
    }
    if (menuState === MenuState.Opening) {
      setMenuState(MenuState.Open);
    }
  };
  const onMenuToggle = () => {
    if (menuState === MenuState.Open) {
      setMenuState(MenuState.Closing);
    }
    if (menuState === MenuState.Closed) {
      setMenuState(MenuState.Opening);
    }
  };
  const onMenuClose = () => {
    if (menuState === MenuState.Open) {
      setMenuState(MenuState.Closing);
    }
  };
  return (
    <div className={styles.app} data-testid="app">
      <Header onMenuToggle={onMenuToggle} fixed={smallScreenLayout} />
      <SensorMain />
    </div>
  );
}

export default App;
