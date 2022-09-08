const FIVE_MINUTES = 5 * 60 * 1000;
const THRESHOLD = 20;

export const getStatesFromData = (data: Record<string, [number, number][]>) => {
  const now = +new Date();

  const states = Object.fromEntries(
    Object.entries(data).map(([unitId, unitData]) => {
      const lastFiveMinutes = unitData.filter(
        ([timestamp]) => timestamp > now - FIVE_MINUTES,
      );

      if (lastFiveMinutes.length === 0) {
        return [unitId, 'data_missing'];
      }

      const avgLoudness =
        lastFiveMinutes.reduce((acc, [, loudness]) => acc + loudness, 0) /
        lastFiveMinutes.length;

      return [unitId, avgLoudness > THRESHOLD ? 'on' : 'off'];
    }),
  );

  return states;
};
