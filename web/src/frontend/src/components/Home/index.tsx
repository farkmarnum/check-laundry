import { useEffect, useState } from 'preact/hooks';
import Spinner from '../Spinner';
import washer from '../../assets/washer.svg';

import s from './style.css';

const MAX_WASHER_TIME = 1000 * 60 * 60 * 2; // 2 hrs (ms)

const STATION_ID = 'basement'; // For now, just one station.

const DEMO = true;

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
      if (timeSinceLastEvent > MAX_WASHER_TIME) {
        console.warn(
          `Something's gone wrong! Timestamp is too old (ts = ${timestamp}, now = ${+new Date()}, status = ${status})`,
        );
        status = 'unknown';
      }

      return (
        <div className={s.unit} key={id}>
          <div style="font-weight: bold">{parseInt(id, 10) + 1}</div>
          <img
            src={washer}
            alt="washer"
            className={status === 'on' ? s.inUse : ''}
          />
          {status === 'off' && 'free ✅'}
          {status === 'on' && 'in use ❌'}
          {status !== 'off' && state !== 'on' && 'no data 🤷'}
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
    if (DEMO) {
      const timestamp = +new Date() + 1000 * 60 * 15 * 4;

      // Change state every 15 mins:
      const states = {
        0: ['on', 'on'],
        1: ['on', 'off'],
        2: ['off', 'off'],
        3: ['off', 'on'],
      };
      const parity = (Math.floor(timestamp / 1000 / 60 / 15) %
        4) as keyof typeof states;
      console.log(parity);

      setStationData({
        '0': { state: states[parity][0], timestamp },
        '1': { state: states[parity][1], timestamp },
      });
      return;
    }

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

      // Retry in 5 seconds:
      setTimeout(fetchData, 1000 * 5);
    }
  };

  // Fetch on mount & set up interval:
  useEffect(() => {
    fetchData();

    // Fetch every 30 seconds
    const interval = setInterval(fetchData, 1000 * 30);

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
