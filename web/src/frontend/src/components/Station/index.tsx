import { useEffect, useState } from 'preact/hooks';

import './style.css';

const Station = ({ stationId }: { stationId: string }) => {
  const [stationData, setStationData] = useState();

  useEffect(() => {
    (async () => {
      const resp = await fetch(
        `https://checklaundry.com/api/v1/stationData/${stationId}`,
      );

      const { data } = (await resp.json()) || {};
      if (data) {
        setStationData(data);
      }
    })();
  }, [stationId]);

  const stationName = stationId.replace(/_/g, ' ');

  useEffect(() => {
    document.title = `Check Laundry - ${stationName}`;
  }, [stationName]);

  return (
    <div className="title">
      <h1>{stationName}</h1>
      <div className="units">{JSON.stringify(stationData)}</div>
    </div>
  );
};

export default Station;
