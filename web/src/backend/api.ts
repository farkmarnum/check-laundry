import { RouteHandler } from '@pulumi/cloud';

import { updateStationData, getStationData } from './s3';
import { API_KEY } from '../infra/config';
import { getStatesFromData } from './getStatesFromData';

// NOTE: we don't want to send any response besides a status code, since we want to save bandwidth (IoT LTE)
export const updateStationDataHandler: RouteHandler = async (req, res) => {
  if (req.headers['api-key'] !== API_KEY.get()) {
    res.status(401).end();
    return;
  }

  const { stationId } = req.params;

  if (!stationId) {
    console.error('stationId missing!');
    res.status(400).end();
    return;
  }

  const { data } = JSON.parse(req.body.toString());

  if (!data || Object.keys(data).length < 1) {
    console.error('data missing!');
    res.status(400).end();
    return;
  }

  try {
    await updateStationData({ stationId, data });
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
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
