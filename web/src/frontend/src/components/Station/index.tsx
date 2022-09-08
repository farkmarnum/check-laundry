import { useEffect, useState } from 'preact/hooks';
import Spinner from '../Spinner';

import s from './style.css';

const capitalizeWords = (str: string) =>
  str
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');

const Loading = () => (
  <div>
    <div>Loading laundry data...</div>
    <div style="margin-top: -6px">
      <Spinner />
    </div>
  </div>
);

const Station = ({ stationId }: { stationId: string }) => {
  const [stationData, setStationData] = useState();
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `https://checklaundry.com/api/v1/stationData/${stationId}`,
        );

        const { unitStates } = (await resp.json()) || {};
        if (unitStates) {
          setStationData(unitStates);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data 😕');
      }
    })();
  }, [stationId]);

  const stationName = capitalizeWords(stationId.replace(/_/g, ' '));

  useEffect(() => {
    document.title = `Check Laundry - ${stationName}`;
  }, [stationName]);

  return (
    <div>
      <h1>{stationName}</h1>
      <div className={s.units}>
        {stationData && JSON.stringify(stationData)}
        {error && error}
        {!stationData && !error && <Loading />}
      </div>
    </div>
  );
};

export default Station;
