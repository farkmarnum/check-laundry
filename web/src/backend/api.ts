import { RouteHandler } from '@pulumi/cloud';

import { updateStationData, getStationData } from './s3';
import { API_KEY } from '../infra/config';
import { getStatesFromData } from './getStatesFromData';

export const updateStationDataHandler: RouteHandler = async (req, res) => {
  if (req.headers['api-key'] !== API_KEY.get()) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { stationId } = req.params;

  if (!stationId) {
    res.status(400).json({ message: 'stationId missing!' });
    return;
  }

  const { data } = JSON.parse(req.body.toString());

  if (!data || Object.keys(data).length < 1) {
    res.status(400).json({ message: 'data missing!' });
    return;
  }

  try {
    await updateStationData({ stationId, data });
    res.json({ message: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getStationDataHandler: RouteHandler = async (req, res) => {
  const { stationId } = req.params;

  if (!stationId) {
    res.status(400).json({ message: 'stationId missing!' });
    return;
  }

  try {
    const data = await getStationData({ stationId });
    const unitStates = getStatesFromData(data);
    res.json({ unitStates });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      messaage: (err as { message: string }).message || 'Server Error',
    });
  }
};
