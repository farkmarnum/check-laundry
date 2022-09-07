import * as cloud from '@pulumi/cloud-aws';

import { updateStationData, getStationData } from '../backend/s3';
import { API_KEY, DOMAIN } from './config';
import { certificateArn } from './cert';

const api = new cloud.API('laundry');

/* BACKEND */
api.post('/api/v1/data', async (req, res) => {
  // NOTE: this route is protected by an API key:
  if (req.headers['API-KEY'] !== API_KEY.get()) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { stationId, data: newData } = JSON.parse(req.body.toString());

  if (!stationId) {
    res.status(400).json({ message: 'stationId missing!' });
    return;
  }

  if (!newData || Object.keys(newData).length > 1) {
    res.status(400).json({ message: 'data missing!' });
    return;
  }

  try {
    await updateStationData({ stationId, newData });
    res.json({ message: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

api.get('/api/v1/data/{stationId}', async (req, res) => {
  const { stationId } = req.params;

  if (!stationId) {
    res.status(400).json({ message: 'stationId missing!' });
    return;
  }

  try {
    const data = await getStationData({ stationId });
    res.json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      messaage: (err as { message: string }).message || 'Server Error',
    });
  }
});

/* FRONTEND */
api.static('$default', `${__dirname}/../frontend/index.html`, {
  contentType: 'text/html',
});

api.attachCustomDomain({ domainName: DOMAIN, certificateArn });

const { url, customDomains } = api.publish();

export const apiUrl = url;
export const { cloudfrontDomainName, cloudfrontZoneId } = customDomains[0];
