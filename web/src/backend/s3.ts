import { bucket } from '../infra/bucket';

/**
 * DATA STRUCTURE FOR S3
 *
 * 1 Bucket
 *
 * Each laundry station is a Key
 *
 * The data in the object is in this form: {
 *   unitId: Array<{timestamp: number, state: 'on' | 'off' | 'unknown'}>,
 * }
 */

type StationDataSingle = Record<string, { state: string; timestamp: number }>;
type StationData = Record<string, { state: string; timestamp: number }[]>;

export const updateStationData = async ({
  stationId,
  data,
}: {
  stationId: string;
  data: StationDataSingle;
}) => {
  let stationData: StationData;
  try {
    const blob = await bucket.get(stationId);
    stationData = JSON.parse(blob.toString() || '{}');
  } catch (err) {
    if ((err as { code: string }).code === 'NoSuchKey') {
      stationData = {};
    } else {
      throw err;
    }
  }

  Object.entries(data).forEach(([unitId, { state, timestamp }]) => {
    if (!stationData[unitId]) {
      stationData[unitId] = [];
    }

    stationData[unitId].push({ state, timestamp });
  });

  await bucket.put(stationId, Buffer.from(JSON.stringify(stationData)));
};

export const getStationData = async ({ stationId }: { stationId: string }) => {
  let stationData: StationData;
  try {
    const blob = await bucket.get(stationId);
    stationData = JSON.parse(blob.toString() || '{}');
  } catch (err) {
    if ((err as { code: string }).code === 'NoSuchKey') {
      stationData = {};
    } else {
      throw err;
    }
  }

  const currentData: StationDataSingle = {};

  Object.entries(stationData).forEach(([unitId, unitData]) => {
    const lastDataPoint = unitData.slice(-1)[0];
    const { state, timestamp } = lastDataPoint;

    currentData[unitId] = { state, timestamp };
  });

  return currentData;
};
