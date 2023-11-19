import { act, fireEvent, render } from '@testing-library/react';
import { Header } from '../../Header/Header';
import { SegmentedControl } from '../SegmentedControl';
import { getUid } from '../../../util/uid';

describe('SegmentedControl', () => {
  it('renders without crashing', () => {
    const uid = getUid();
    const { getByTestId } = render(
      <SegmentedControl
        selectedOption={'all'}
        onOptionSelect={() => {}}
        options={[]}
        testUid={uid}
      />
    );

    expect(getByTestId(`segmented-control-${uid}`)).toBeInTheDocument();
  });

  it.skip('calls onOptionSelect when an option is clicked', () => {
    const onOptionSelect = jest.fn();
    const uid = getUid();
    const { getByTestId } = render(
      <SegmentedControl
        selectedOption={'all'}
        onOptionSelect={onOptionSelect}
        options={[
          {
            label: 'All',
            value: 'all',
          },
          {
            label: 'Active',
            value: 'active',
          },
          {
            label: 'Completed',
            value: 'completed',
          },
        ]}
        testUid={uid}
      />
    );
    act(() => {
      fireEvent.change(getByTestId(`segmented-control-input-${uid}-${1}`), {
        target: {
          value: 'active',
          checked: true,
        },
      });
    });
    expect(onOptionSelect).toHaveBeenCalledWith('all');
  });

  it('matches snapshot', () => {
    const uid = 1;
    const { container } = render(
      <SegmentedControl
        selectedOption={'all'}
        onOptionSelect={() => {}}
        options={[
          {
            label: 'All',
            value: 'all',
          },
          {
            label: 'Active',
            value: 'active',
          },

          {
            label: 'Completed',
            value: 'completed',
          },
        ]}
        testUid={uid}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
