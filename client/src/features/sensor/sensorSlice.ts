import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../App/store';
import { ConnectionFilter, PAGE_LENGTH } from './sensorConstants';
import { SetProgressActionPayload } from './sensorTypes';

export interface Sensor {
  id: string;
  name: string;
  connected: boolean;
  progress: boolean;
  unit: string;
  value: string | null;
}

export interface SensorsState {
  sensorIds: string[];
  sensors: Record<string, Sensor>;
  appliedFilter: ConnectionFilter;
  currentPage: number;
}

export const initialState: SensorsState = {
  sensorIds: [],
  sensors: {},
  appliedFilter: ConnectionFilter.All,
  currentPage: 1,
};

type AddSensorDataPayload = {
  id: string;
  name: string;
  connected: boolean;
  unit: string;
  value: string | null;
};

export const sensorSlice = createSlice({
  name: 'sensor',
  initialState: () => initialState,
  reducers: {
    addSensorData: (state, action: PayloadAction<AddSensorDataPayload>) => {
      const id = action.payload.id;
      if (id in state.sensors) {
        state.sensors[id]!.connected = action.payload.connected;
        state.sensors[id]!.value = action.payload.value;
        return;
      }
      const data: Sensor = {
        id,
        name: action.payload.name,
        connected: action.payload.connected,
        value: action.payload.value,
        unit: action.payload.unit,
        progress: false,
      };
      state.sensorIds.push(id);
      state.sensors[id] = data;
    },
    applyFilter: (state, action: PayloadAction<ConnectionFilter>) => {
      state.appliedFilter = action.payload;
      state.currentPage = 1;
    },
    setNextPageInternal: (state) => {
      state.currentPage++;
    },
    setPreviousPageInternal: (state) => {
      state.currentPage--;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setProgress: (state, action: PayloadAction<SetProgressActionPayload>) => {
      if (action.payload.id in state.sensors) {
        state.sensors[action.payload.id]!.progress = action.payload.progress;
      }
    },
  },
});

export const {
  addSensorData,
  applyFilter,
  setCurrentPage,
  setNextPageInternal,
  setPreviousPageInternal,
  setProgress,
} = sensorSlice.actions;

// Thunks.
export const setNextPage = (): AppThunk => (dispatch, getState) => {
  const sensorsState = getState().sensor;
  if (sensorsState.currentPage < selectNumberOfPages(getState())) {
    dispatch(setNextPageInternal());
  }
};

export const setPreviousPage = (): AppThunk => (dispatch, getState) => {
  if (getState().sensor.currentPage > 1) {
    dispatch(setPreviousPageInternal());
  }
};

// Selectors.
export const selectSensors = (state: RootState) =>
  state.sensor.sensorIds
    .map((id) => state.sensor.sensors[id]!)
    .filter((s) => checkFilter(state, s!))
    .map((s) => s.id);

export const checkFilter = (state: RootState, task: Sensor): boolean => {
  switch (state.sensor.appliedFilter) {
    case ConnectionFilter.All:
      return true;
    case ConnectionFilter.Connected:
      return task.connected;
  }
};

export const selectNumberOfPages = (state: RootState) => {
  return Math.ceil(selectSensors(state).length / PAGE_LENGTH);
};

export const selectCurrentPage = (state: RootState) => {
  return state.sensor.currentPage;
};

// Selected sensors for the current page.
export const selectTasksByPage = (state: RootState) => {
  const start = (state.sensor.currentPage - 1) * PAGE_LENGTH;
  const end = start + PAGE_LENGTH;
  return selectSensors(state).slice(start, end);
};

export const selectAppliedFilter = (state: RootState) =>
  state.sensor.appliedFilter;

export const selectSensorData = (id: string) => (state: RootState) =>
  state.sensor.sensors[id]!;

export const sensorReducer = sensorSlice.reducer;
