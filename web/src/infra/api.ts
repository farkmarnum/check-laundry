import * as path from 'path';
import * as cloud from '@pulumi/cloud-aws';

import {
  updateStationDataHandler,
  getStationDataHandler,
} from '../backend/api';
import { DOMAIN } from './config';
import { certificateArn } from './cert';

const api = new cloud.API('laundry');

export const STATION_DATA_PATH = '/stationData/{stationId}';

// GET request for frontend to pull data:
api.get(STATION_DATA_PATH, getStationDataHandler);

// POST request for devices to update data (protected by API key):
api.post(STATION_DATA_PATH, updateStationDataHandler);

// Static frontend:
const frontendDir = path.join(__dirname, '../frontend/build');
api.static('/', frontendDir);

// Domain mapping:
api.attachCustomDomain({ domainName: DOMAIN, certificateArn });

export const { url, customDomains, routes, api: apiInternal } = api.publish();
export const { cloudfrontDomainName, cloudfrontZoneId } = customDomains[0];

export const lambdaforMainGet = apiInternal.getFunction(
  STATION_DATA_PATH,
  'GET',
);
