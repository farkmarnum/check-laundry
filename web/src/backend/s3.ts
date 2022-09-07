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

export const updateStationData = async ({
  stationId,
  data,
}: {
  stationId: string;
  data: Record<string, number>;
}) => {
  const timestamp = +new Date();

  const blob = await bucket.get(stationId);
  const unitData: Record<string, [number, number][]> = JSON.parse(
    blob.toString() || '{}',
  );

  Object.entries(data as Record<string, number>).forEach(
    ([unitId, loudnessLevel]) => {
      if (!unitData[unitId]) {
        unitData[unitId] = [];
      }

      unitData[unitId].push([timestamp, loudnessLevel]);
    },
  );

  await bucket.put(stationId, Buffer.from(JSON.stringify(unitData)));
};

export const getStationData = async ({ stationId }: { stationId: string }) => {
  const blob = await bucket.get(stationId);
  const stationData: Record<string, [number, number][]> = JSON.parse(
    blob.toString() || '{}',
  );

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
