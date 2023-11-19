import {
  addTask,
  addTaskInternal,
  applyFilter,
  applyFilterInternal,
  completeTask,
  DEFAULT_TASKS,
  removeTask,
  renameTask,
  Sensor,
  ConnectionFilter,
  taskReducer,
  SensorsState,
} from '../sensorSlice';

let initialState: SensorsState;

describe('task reducer', () => {
  beforeEach(() => {
    initialState = {
      sensorIds: [],
      sensors: {},
      appliedFilter: TaskFilter.All,
      currentPage: 1,
    };
  });

  it('should handle initial state', () => {
    expect(taskReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addTask', () => {
    const actual = taskReducer(
      initialState,
      addTaskInternal({
        title: 'Sensor 4',
        listId: 0,
      })
    );
    expect(actual.sensorIds.length).toEqual(1);
    const firstTaskId = actual.sensorIds[0];
    expect(actual.sensors[firstTaskId].title).toEqual('Sensor 4');
    expect(actual.sensors[firstTaskId].completed).toEqual(false);
  });

  it('should handle addTask without title', () => {
    const actual = taskReducer(
      initialState,
      addTaskInternal({
        title: '',
        listId: 0,
      })
    );
    expect(actual.sensorIds.length).toEqual(1);
    const firstTaskId = actual.sensorIds[0];
    expect(actual.sensors[firstTaskId].title).toEqual('New Sensor');
    expect(actual.sensors[firstTaskId].completed).toEqual(false);
  });

  it('should handle removeTask', () => {
    let actual = taskReducer(
      initialState,
      addTaskInternal({
        title: '',
        listId: 0,
      })
    );
    actual = taskReducer(actual, removeTask(2));
    expect(actual.sensorIds.length).toEqual(0);
    expect(actual.sensors[2]).not.toBeDefined();
  });

  it('should handle completeTask', () => {
    let actual = taskReducer(
      initialState,
      addTaskInternal({
        title: '',
        listId: 0,
      })
    );

    actual = taskReducer(actual, completeTask(3));
    expect(actual.sensors[3].completed).toEqual(true);
  });

  it('should handle renameTask', () => {
    let actual = taskReducer(
      initialState,
      addTaskInternal({
        title: '',
        listId: 0,
      })
    );
    actual = taskReducer(
      actual,
      renameTask({
        id: 4,
        title: 'New Title',
      })
    );
    expect(actual.sensors[4].title).toEqual('New Title');
  });

  it('should handle applyFilter', () => {
    const actual = taskReducer(initialState, applyFilter(TaskFilter.Completed));
    expect(actual.appliedFilter).toEqual(TaskFilter.Completed);
  });

  it('should handle applyFilterInternal', () => {
    const actual = taskReducer(
      initialState,
      applyFilterInternal(TaskFilter.Completed)
    );
    expect(actual.appliedFilter).toEqual(TaskFilter.Completed);
  });
});
