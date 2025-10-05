import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadEvents } from '../store/slices/eventsSlice';
import { selectEvents, selectLoading } from '../store/slices/eventsSlice';
import type { TableColumn, SortConfig, FilterConfig } from '../types/Event';
import './TablePage.css';

const TablePage = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const loading = useAppSelector(selectLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<FilterConfig[]>([]);

  const [columns, setColumns] = useState<TableColumn[]>([
    { key: 'timestamp', label: 'Timestamp', visible: true },
    { key: 'attacker.id', label: 'Attacker ID', visible: true },
    { key: 'attacker.ip', label: 'Attacker IP', visible: true },
    { key: 'attacker.name', label: 'Attacker Name', visible: true },
    { key: 'type', label: 'Type', visible: true },
    { key: 'decoy.name', label: 'Decoy Name', visible: true },
    { key: 'severity', label: 'Severity', visible: false },
    { key: 'kill_chain_phase', label: 'Kill Chain Phase', visible: false },
    { key: 'attacker.port', label: 'Attacker Port', visible: false },
    { key: 'decoy.id', label: 'Decoy ID', visible: false },
    { key: 'decoy.group', label: 'Decoy Group', visible: false },
    { key: 'decoy.ip', label: 'Decoy IP', visible: false },
    { key: 'decoy.port', label: 'Decoy Port', visible: false },
    { key: 'decoy.type', label: 'Decoy Type', visible: false },
  ]);

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Apply column filters
    filters.forEach(filter => {
      if (filter.value) {
        filtered = filtered.filter(event => {
          const eventValue = (event as any)[filter.key];
          return String(eventValue).toLowerCase().includes(filter.value.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a as any)[sortConfig.key];
        const bValue = (b as any)[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [events, filters, sortConfig]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedEvents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => {
      const existing = prev.find(f => f.key === key);
      if (existing) {
        if (value) {
          return prev.map(f => f.key === key ? { ...f, value } : f);
        } else {
          return prev.filter(f => f.key !== key);
        }
      } else if (value) {
        return [...prev, { key, value }];
      }
      return prev;
    });
  };

  const toggleColumnVisibility = (key: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const visibleColumns = columns.filter(col => col.visible);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="table-page">
      <div className="page-header">
        <h2>Event Table</h2>
        <div className="table-controls">
          <div className="column-selector">
            <button className="column-toggle-btn">Select Columns</button>
            <div className="column-dropdown">
              {columns.map(column => (
                <label key={column.key} className="column-option">
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => toggleColumnVisibility(column.key)}
                  />
                  {column.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="events-table">
          <thead>
            <tr>
              {visibleColumns.map(column => (
                <th key={column.key} className="table-header">
                  <div className="header-content">
                    <span onClick={() => handleSort(column.key)} className="sortable-header">
                      {column.label}
                      {sortConfig?.key === column.key && (
                        <span className="sort-indicator">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </span>
                    <input
                      type="text"
                      placeholder={`Filter ${column.label}...`}
                      value={filters.find(f => f.key === column.key)?.value || ''}
                      onChange={(e) => handleFilter(column.key, e.target.value)}
                      className="filter-input"
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedEvents.map((event) => (
              <tr key={event.id} className="table-row">
                {visibleColumns.map(column => (
                  <td key={column.key} className="table-cell">
                    {column.key === 'timestamp' 
                      ? new Date(event.timestamp).toLocaleString()
                      : (event as any)[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedEvents.length)} of {filteredAndSortedEvents.length} events
        </div>
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablePage;
