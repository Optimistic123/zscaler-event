import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <h1 className="nav-title">Event Dashboard</h1>
        <div className="nav-links">
          <Link 
            to="/graph" 
            className={`nav-link ${location.pathname === '/' || location.pathname === '/graph' ? 'active' : ''}`}
          >
            Graph
          </Link>
          <Link 
            to="/table" 
            className={`nav-link ${location.pathname === '/table' ? 'active' : ''}`}
          >
            Table
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

