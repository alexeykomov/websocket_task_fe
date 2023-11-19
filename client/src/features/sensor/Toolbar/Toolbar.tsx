import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { applyFilter, selectAppliedFilter } from '../sensorSlice';
import { SegmentedControl } from '../../../components/SegmentedControl/SegmentedControl';
import { Pager } from '../Pager/Pager';
import styles from './Toolbar.module.css';
import { ConnectionFilter } from '../sensorConstants';

export const Toolbar = () => {
  const dispatch = useAppDispatch();
  const onFilterSelect = (filter: string) => {
    dispatch(applyFilter(filter as ConnectionFilter));
  };
  const appliedFilter = useAppSelector(selectAppliedFilter);
  return (
    <div className={styles.root}>
      <Pager />
      <SegmentedControl
        options={[
          { value: ConnectionFilter.All, label: 'ALL' },
          { value: ConnectionFilter.Connected, label: 'Connected' },
        ]}
        onOptionSelect={onFilterSelect}
        selectedOption={appliedFilter}
      />
    </div>
  );
};
