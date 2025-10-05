import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventsSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['events/setDateRange', 'events/setStartDate', 'events/setEndDate'],
        ignoredPaths: ['events.startDate', 'events.endDate'],
        ignoredActionsPaths: ['payload'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
