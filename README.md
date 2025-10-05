## Features

- **Interactive Timeline Graph**: Visualize events over time with hourly aggregations
- **Data Table View**: Browse and filter events in a detailed table format
- **Date Range Filtering**: Select custom date ranges to analyze specific time periods
- **Real-time Updates**: Graph and table data update automatically when filters change

## Prerequisites

- **Node.js**: Version 20.19+ , used(v22)

## Installation & Setup
npm install
npm run dev

## Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx      # Main navigation component
│   └── Navigation.css      # Navigation styles
├── pages/
│   ├── GraphPage.tsx       # Timeline graph visualization
│   ├── GraphPage.css       # Graph page styles
│   ├── TablePage.tsx       # Data table view
│   └── TablePage.css       # Table page styles
├── store/
│   ├── index.ts            # Redux store configuration
│   ├── hooks.ts            # Typed Redux hooks
│   └── slices/
│       └── eventsSlice.ts  # Events state management
├── types/
│   └── Event.ts            # TypeScript type definitions
├── App.tsx                 # Main application component
├── App.css                 # Global application styles
├── main.tsx                # Application entry point
└── index.css               # Base CSS styles
```

## Architecture & State Management

### **State Management Choice: Redux Toolkit**
**Decision**: Implemented Redux Toolkit for centralized state management instead of local React hooks.

### **Redux Architecture**

#### **Store Structure**
```typescript
// Centralized store with typed selectors
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
```

#### **Slice-based State Management**
```typescript
// Events slice with async thunks and selectors
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadEvents.fulfilled, (state, action) => {
      state.events = action.payload;
    });
  },
});
```

#### **Memoized Selectors for Performance**
```typescript
// Computed selectors that only recalculate when dependencies change
export const selectFilteredEventsByDate = createSelector(
  [
    (state) => state.events.events,
    (state) => state.events.startDate,
    (state) => state.events.endDate
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
```

#### **Clear Responsibilities**
- **Store**: Centralized state management with Redux Toolkit
- **Slices**: Feature-based state organization
- **Selectors**: Computed state with memoization
- **Components**: UI rendering with Redux hooks
- **Async Thunks**: Side effects and data fetching

## Performance Optimization

### **Redux Performance Benefits**

#### **Memoized Selectors**
// Selectors automatically memoize results using createSelector

#### **Efficient State Updates**
- **Immer Integration**: Redux Toolkit uses Immer for immutable updates
- **Selective Re-renders**: Components only re-render when their specific data changes
- **Batch Updates**: Multiple state changes are batched automatically
- **Date Object Handling**: Proper serialization configuration for Date objects in actions

#### **Async Data Loading**
```typescript
// Async thunks handle loading states automatically
export const loadEvents = createAsyncThunk(
  'events/loadEvents',
  async () => {
    const response = await fetch('/Data.json');
    return await response.json();
  }
);
```


### **Routing**
- **React Router DOM**: Client-side routing for navigation between graph and table views

### **Data Visualization**
- **Highchart**: Professional charting library for React

### **Date Handling**
- **React DatePicker**: User-friendly date selection component
- **Native Date API**: JavaScript Date objects for date manipulation and filtering
- **UTC Timestamps**: Proper handling of timezone-aware data

### Data Format
interface Event {
  id: string;
  type: string;
  severity: string;
  kill_chain_phase: string;
  timestamp: string; // ISO 8601 format (e.g., "2021-08-24T13:06:44Z")
  'attacker.id': string;
  'attacker.ip': string;
  'attacker.name': string;
  'attacker.port': number;
  'decoy.id': number;
  'decoy.name': string;
  'decoy.group': string;
  'decoy.ip': string;
  'decoy.port': number;
  'decoy.type': string;
}

### **Performance Optimizations**
- **Redux Memoized Selectors**: `createSelector` prevents unnecessary recalculations
- **Date Range Optimization**: Memoized date range selectors prevent object recreation
- **Component Re-render Prevention**: Selectors only trigger updates when dependencies change
- **Memory Management**: Proper cleanup and efficient data structures


