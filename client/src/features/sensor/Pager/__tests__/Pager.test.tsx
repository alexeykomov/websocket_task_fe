import { Pager } from '../Pager';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  initialState as initialStateTask,
  ConnectionFilter,
  SensorsState,
} from '../../sensorSlice';
import {
  initialState as initialStateTaskList,
  TaskList,
  TaskListState,
} from '../../../tasklist/taskListSlice';
import { initialState as initialStateCounter } from '../../../counter/counterSlice';
import { RootState, store } from '../../../../App/store';
import { renderWithProviders } from '../../../../util/test-utils';

describe('Pager', () => {
  beforeEach(() => {});

  it('renders pager placeholder', () => {
    const { getByTestId } = renderWithProviders(<Pager />);
    expect(getByTestId('pager-placeholder')).toBeInTheDocument();
  });

  it('renders pager', () => {
    //Create 20 sensors for store.
    const initialStateTask: SensorsState = {
      sensorIds: [],
      sensors: {},
      currentPage: 1,
      appliedFilter: TaskFilter.All,
    };
    for (let i = 0; i < 20; i++) {
      initialStateTask.sensorIds.push(i);
      initialStateTask.sensors[i] = {
        id: i,
        title: `Task ${i}`,
        completed: false,
        listId: 1,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      };
    }

    const initialStateTaskList: TaskListState = {
      taskListIds: [1],
      taskLists: {
        1: {
          id: 1,
          title: 'Sensor List 1',
          deletable: true,
        },
      },
      activeTaskList: 1,
    };

    const { getByTestId } = renderWithProviders(<Pager />, {
      taskList: initialStateTaskList,
      task: initialStateTask,
    } as RootState);

    expect(getByTestId('pager')).toBeInTheDocument();
  });

  it('renders the correct number of pages', () => {
    // Create a mock store with a state that has 10 pages.
    const initialStateTask: SensorsState = {
      sensorIds: [],
      sensors: {},
      currentPage: 1,
      appliedFilter: TaskFilter.All,
    };
    for (let i = 0; i < 101; i++) {
      initialStateTask.sensorIds.push(i);
      initialStateTask.sensors[i] = {
        id: i,
        title: `Task ${i}`,
        completed: false,
        listId: 1,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      };
    }

    const initialStateTaskList: TaskListState = {
      taskListIds: [1],
      taskLists: {
        1: {
          id: 1,
          title: 'Sensor List 1',
          deletable: true,
        },
      },
      activeTaskList: 1,
    };

    const { getByTestId } = renderWithProviders(<Pager />, {
      taskList: initialStateTaskList,
      task: initialStateTask,
    } as RootState);

    expect(getByTestId('pager')).toHaveTextContent('1 / 11');
  });
});
