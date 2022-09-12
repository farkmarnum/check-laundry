import fetch from 'node-fetch';
import * as aws from '@pulumi/aws';
import { STATION_DATA_PATH } from './api';
import { DOMAIN } from './config';

const STATION_FOR_WARMING = 'basement';

/**
 * This calls the endpoint for station data once every 5 minutes to prevent Lambda cold starts
 */

const eventRule = new aws.cloudwatch.EventRule(
  `laundry-lambdaforMainGet-warming-rule`,
  { scheduleExpression: 'rate(5 minutes)' },
);

export const subscription = new aws.cloudwatch.EventRuleEventSubscription(
  `laundry-lambdaforMainGet-warming-subscription`,
  eventRule,
  async () => {
    const url = `https://${DOMAIN}${STATION_DATA_PATH}`.replace(
      '{stationId}',
      STATION_FOR_WARMING,
    );
    await fetch(url);
  },
);
