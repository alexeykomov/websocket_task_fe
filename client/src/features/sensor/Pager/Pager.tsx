import {
  selectCurrentPage,
  selectNumberOfPages,
  setNextPage,
  setPreviousPage,
} from '../sensorSlice';
import { useAppDispatch, useAppSelector } from '../../../App/hooks';
import { inspect } from 'util';
import styles from './Pager.module.css';
import clsx from 'clsx';

export const Pager = () => {
  const numberOfPages = useAppSelector(selectNumberOfPages);
  const currentPage = useAppSelector(selectCurrentPage);
  const dispatch = useAppDispatch();
  const onPrev = () => {
    dispatch(setPreviousPage());
  };
  const onNext = () => {
    dispatch(setNextPage());
  };

  return numberOfPages > 1 ? (
    <div className={styles.root} data-testid="pager">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous page"
        className={clsx(styles.button, styles['button-prev'])}
        disabled={currentPage === 1}
      />
      <span className={styles.page} data-testid="pager-pages">
        {currentPage} / {numberOfPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next page"
        className={clsx(styles.button, styles.last, styles['button-next'])}
        disabled={currentPage === numberOfPages}
      />
    </div>
  ) : (
    // We need this empty div to keep the space-between layout of the toolbar.
    <div data-testid="pager-placeholder" />
  );
};
