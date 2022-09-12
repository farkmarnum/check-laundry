import { useEffect, useState } from 'preact/hooks';
import Spinner from '../Spinner';
import washer from '../../assets/washer.svg';

import s from './style.css';

const MAX_WASHER_TIME = 1000 * 60 * 60 * 2; // 2 hrs (ms)

const STATION_ID = 'basement'; // For now, just one station.

const Loading = () => (
  <div>
    <div>Loading laundry data...</div>
    <Spinner />
  </div>
);

const Stations = ({
  data,
}: {
  data: Record<string, { state: string; timestamp: number }>;
}) => (
  <>
    {Object.entries(data).map(([id, { state, timestamp }]) => {
      let status = state;

      const timeSinceLastEvent = +new Date() - timestamp;
      if (timeSinceLastEvent > MAX_WASHER_TIME && status === 'on') {
        console.warn(
          `Something's gone wrong! Status is 'on' but timestamp is too old (ts = ${timestamp}, now = ${+new Date()}`,
        );
        status = 'unknown';
      }

      return (
        <div className={s.unit} key={id}>
          <div style="font-weight: bold">{parseInt(id, 10) + 1}</div>
          <img
            src={washer}
            alt="washer"
            className={state === 'on' ? s.inUse : ''}
          />
          {state === 'off' && 'free ✅'}
          {state === 'on' && 'in use ❌'}
          {state !== 'off' && state !== 'on' && 'no data 🤷'}
        </div>
      );
    })}
  </>
);

const Home = () => {
  const [stationData, setStationData] =
    useState<Record<string, { state: string; timestamp: number }>>();
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const resp = await fetch(
        `https://checklaundry.com/stationData/${STATION_ID}`,
      );

      const { data } = (await resp.json()) || {};
      if (data) {
        setStationData(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data! 😕');
    }
  };

  // Fetch on mount & set up interval:
  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 1000 * 60);

    // On unmount:
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h1>Check Laundry 🧺</h1>
      <div className={s.units}>
        {error && error}
        {!error && stationData && <Stations data={stationData} />}
        {!error && !stationData && <Loading />}
      </div>
    </div>
  );
};

export default Home;
