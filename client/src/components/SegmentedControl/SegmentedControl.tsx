import { ChangeEvent, useState } from 'react';
import { getUid } from '../../util/uid';
import styles from './SegmentedControl.module.css';
import clsx from 'clsx';
import React from 'react';
import { ConnectionFilter } from '../../features/sensor/sensorConstants';


export interface SegmentedControlProps {
  options: Array<{ label: string; value: string }>;
  onOptionSelect: (value: string) => void;
  selectedOption: string;
  testUid?: number;
}

export const SegmentedControl = ({
  options,
  onOptionSelect,
  selectedOption,
  testUid,
}: SegmentedControlProps) => {
  const [uid] = useState(Number.isInteger(testUid) ? testUid : getUid());

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const value = e.target.value;
      onOptionSelect(value as ConnectionFilter);
    }
  };

  return (
    <div className={styles.root} data-testid={`segmented-control-${uid}`}>
      <div className={styles['label-cont']}>
        {options.map((option, index) => {
          const id = `id-${option.value}-${uid}`;
          return (
            <React.Fragment key={option.value}>
              <input
                type="radio"
                id={id}
                name={`segmented-control-${uid}`}
                value={option.value}
                className={styles.input}
                onChange={handleChange}
                checked={option.value === selectedOption}
                data-testid={`segmented-control-input-${uid}-${index}`}
              />
              <label
                htmlFor={id}
                className={clsx(
                  styles.label,
                  index === options.length - 1 && styles['label-last']
                )}
                data-testid={`segmented-control-label-${uid}-${index}`}
              >
                {option.label}
              </label>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
