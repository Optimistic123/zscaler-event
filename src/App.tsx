import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navigation from './components/Navigation';
import GraphPage from './pages/GraphPage';
import TablePage from './pages/TablePage';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<GraphPage />} />
              <Route path="/graph" element={<GraphPage />} />
              <Route path="/table" element={<TablePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
