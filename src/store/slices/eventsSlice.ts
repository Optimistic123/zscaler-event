import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { Event } from '../../types/Event';

// Async thunk for loading events
export const loadEvents = createAsyncThunk(
  'events/loadEvents',
  async () => {
    const response = await fetch('/Data.json');
    if (!response.ok) {
      throw new Error('Failed to load events');
    }
    const data = await response.json();
    return data as Event[];
  }
);

interface EventsState {
  events: Event[];
  startDate: Date;
  endDate: Date;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  startDate: new Date('2021-07-26'),
  endDate: new Date('2021-08-25'),
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(loadEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load events';
      });
  },
});

// Selectors
export const selectEvents = (state: { events: EventsState }) => state.events.events;
export const selectDateRange = createSelector(
  [
    (state: { events: EventsState }) => state.events.startDate,
    (state: { events: EventsState }) => state.events.endDate
  ],
  (startDate, endDate) => ({
    startDate,
    endDate,
  })
);
export const selectLoading = (state: { events: EventsState }) => state.events.loading;

export const selectFilteredEventsByDate = createSelector(
  [
    (state: { events: EventsState }) => state.events.events,
    (state: { events: EventsState }) => state.events.startDate,
    (state: { events: EventsState }) => state.events.endDate
  ],
  (events, startDate, endDate) => {
    return events.filter(event => {
      const eventDate = new Date(event.timestamp);
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      return eventDate >= startOfDay && eventDate <= endOfDay;
    });
  }
);

export const selectTimeSeriesDataHighcharts = createSelector(
  [selectFilteredEventsByDate],
  (filteredEvents) => {
    const dataMap = new Map<number, number>();
    filteredEvents.forEach(event => {
      const date = new Date(event.timestamp);
      const hour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).getTime();
      dataMap.set(hour, (dataMap.get(hour) || 0) + 1);
    });
    return Array.from(dataMap.entries())
      .sort((a, b) => a[0] - b[0]);
  }
);

export const { setDateRange, setStartDate, setEndDate } = eventsSlice.actions;
export default eventsSlice.reducer;
