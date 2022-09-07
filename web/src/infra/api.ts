import * as path from 'path';
import * as cloud from '@pulumi/cloud-aws';

// import { updateStationData, getStationData } from '../backend/s3';
import {
  updateStationDataHandler,
  getStationDataHandler,
} from '../backend/api';
import { DOMAIN } from './config';
import { certificateArn } from './cert';

const api = new cloud.API('laundry');

// GET request for frontend to pull data:
api.get(`/api/v1/stationData/{stationId}`, getStationDataHandler);

// POST request for devices to update data (protected by API key):
api.post(`/api/v1/stationData/{stationId}`, updateStationDataHandler);

// Static frontend:
const frontendDir = path.join(__dirname, '../frontend/');
api.static('/', frontendDir);

// Domain mapping:
api.attachCustomDomain({ domainName: DOMAIN, certificateArn });

const { url, customDomains } = api.publish();
export const apiUrl = url;
export const { cloudfrontDomainName, cloudfrontZoneId } = customDomains[0];
