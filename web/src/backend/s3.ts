import { bucket } from '../infra/bucket';

const TIME_CHUNK = 1000 * 60 * 60 * 2; // 2 hours (ms)

/**
 * DATA STRUCTURE FOR S3
 *
 * 1 Bucket
 *
 * Each laundry station is a Key
 *
 * The data in the object is in this form: {
 *   unitId: Array<[timestamp, loudnessLevel]>,
 * }
 */

type StationData = Record<string, [number, number][]>;

export const updateStationData = async ({
  stationId,
  data,
}: {
  stationId: string;
  data: Record<string, number>;
}) => {
  const timestamp = +new Date();

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

  Object.entries(data as Record<string, number>).forEach(
    ([unitId, loudnessLevel]) => {
      if (!stationData[unitId]) {
        stationData[unitId] = [];
      }

      stationData[unitId].push([timestamp, loudnessLevel]);
    },
  );

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

  const timeThreshold = +new Date() - TIME_CHUNK;

  const recentStationData = Object.fromEntries(
    Object.entries(stationData).map(([unitId, unitData]) => {
      const recentData = unitData.filter(
        ([timestamp]) => timestamp > timeThreshold,
      );
      return [unitId, recentData];
    }),
  );

  return recentStationData;
};
