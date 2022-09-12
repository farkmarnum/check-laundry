import { useEffect, useState } from 'preact/hooks';
import Spinner from '../Spinner';
import washer from '../../assets/washer.svg';

import s from './style.css';

const STATION_ID = 'basement'; // For now, just one station.

const Loading = () => (
  <div>
    <div>Loading laundry data...</div>
    <Spinner />
  </div>
);

const Stations = ({ data }: { data: Record<string, string> }) => (
  <>
    {Object.entries(data).map(([id, status]) => (
      <div className={s.unit} key={id}>
        <div style="font-weight: bold">{parseInt(id, 10) + 1}</div>
        <img
          src={washer}
          alt="washer"
          className={status === 'on' ? s.inUse : ''}
        />
        {status === 'off' && 'free ✅'}
        {status === 'on' && 'in use ❌'}
        {status === 'data_missing' && 'no data 🤷'}
      </div>
    ))}
  </>
);

const Home = () => {
  const [stationData, setStationData] = useState<Record<string, string>>();
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `https://checklaundry.com/api/v1/stationData/${STATION_ID}`,
        );

        const { unitStates } = (await resp.json()) || {};
        if (unitStates) {
          setStationData(unitStates);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data! 😕');
      }
    })();
  }, []);

  return (
    <div>
      <h1>Check Laundry 🧺</h1>
      <div className={s.units}>
        {stationData && <Stations data={stationData} />}
        {error && error}
        {!stationData && !error && <Loading />}
      </div>
    </div>
  );
};

export default Home;
