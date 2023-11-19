import { SensorList } from '../TaskList';
import { renderWithProviders } from '../../../util/test-utils';
import { ConnectionFilter, SensorsState } from '../sensorSlice';
import { TaskListState } from '../../tasklist/taskListSlice';
import { RootState } from '../../../App/store';

let initialStateTask: SensorsState;

let initialStateTaskList: TaskListState;

describe('TaskList', () => {
  beforeEach(() => {
    initialStateTask = {
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

    initialStateTaskList = {
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
  });

  it('should render successfully', () => {
    const preloadedState = {
      taskList: initialStateTaskList,
      task: initialStateTask,
    };
    const { baseElement } = renderWithProviders(
      <SensorList />,
      preloadedState as RootState
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render to a snapshot', () => {
    const preloadedState = {
      taskList: initialStateTaskList,
      task: initialStateTask,
    };
    const { baseElement } = renderWithProviders(
      <SensorList />,
      preloadedState as RootState
    );
    expect(baseElement).toMatchSnapshot();
  });
});
