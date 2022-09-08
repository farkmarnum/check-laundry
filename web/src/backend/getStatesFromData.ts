const RECENT_TIMESPAN = 3 * 60 * 1000; // 3 minutes
const THRESHOLD = 20;

export const getStatesFromData = (data: Record<string, [number, number][]>) => {
  const now = +new Date();

  const states = Object.fromEntries(
    Object.entries(data).map(([unitId, unitData]) => {
      const recentData = unitData.filter(
        ([timestamp]) => timestamp > now - RECENT_TIMESPAN,
      );

      if (recentData.length === 0) {
        return [unitId, 'data_missing'];
      }

      const avgLoudness =
        recentData.reduce((acc, [, loudness]) => acc + loudness, 0) /
        recentData.length;

      return [unitId, avgLoudness > THRESHOLD ? 'on' : 'off'];
    }),
  );

  return states;
};
