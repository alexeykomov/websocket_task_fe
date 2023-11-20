import React from 'react';
import styles from './Header.module.css';
import clsx from 'clsx';

export interface HeaderProps {
  fixed: boolean;
}

export const Header = ({ fixed }: HeaderProps) => {
  return (
    <header
      className={clsx(
        styles['app-header'],
        fixed && styles['app-header-fixed']
      )}
      data-testid="app-header"
    >
      Sensors data
    </header>
  );
};
