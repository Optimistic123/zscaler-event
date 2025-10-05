import { useEffect, useMemo } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadEvents, setStartDate, setEndDate } from '../store/slices/eventsSlice';
import { 
  selectFilteredEventsByDate, 
  selectDateRange, 
  selectLoading,
  selectTimeSeriesDataHighcharts
} from '../store/slices/eventsSlice';
import './GraphPage.css';

const GraphPage = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const { startDate, endDate } = useAppSelector(selectDateRange);
  const filteredEvents = useAppSelector(selectFilteredEventsByDate);
  const seriesData = useAppSelector(selectTimeSeriesDataHighcharts);

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  const chartOptions = useMemo(() => ({
    title: { text: undefined },
    chart: { zoomType: 'x', height: 400 },
    xAxis: { type: 'datetime', title: { text: 'Time' } },
    yAxis: { title: { text: 'Event Count' }, allowDecimals: false },
    tooltip: {
      xDateFormat: '%Y-%m-%d %H:%M',
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
      shared: true
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        pointPadding: 0.1,
        groupPadding: 0.05
      }
    },
    series: [{
      type: 'column',
      name: 'Events',
      data: seriesData,
      // marker: { radius: 3 }
    }],
    credits: { enabled: false },
    legend: { enabled: false }
  }), [seriesData]);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="graph-page">
      <div className="page-header">
        <h2>Event Timeline</h2>
        <div className="date-range-selector">
          <div className="date-input-group">
            <label>Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => dispatch(setStartDate(date || new Date()))}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              className="date-picker"
              minDate={new Date('2021-07-26')}
              maxDate={new Date('2021-08-25')}
            />
          </div>
          <div className="date-input-group">
            <label>End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => dispatch(setEndDate(date || new Date()))}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              className="date-picker"
              minDate={new Date('2021-07-26')}
              maxDate={new Date('2021-08-25')}
            />
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Events Over Time</h3>
          <p>Total events in selected range: {filteredEvents.length}</p>
        </div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

export default GraphPage;
