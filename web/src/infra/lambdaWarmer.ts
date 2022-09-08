import * as aws from '@pulumi/aws';

import { lambdaforMainGet as lambda } from './api';

const eventRule = new aws.cloudwatch.EventRule(
  `laundry-lambdaforMainGet-warming-rule`,
  { scheduleExpression: 'rate(5 minutes)' },
);

export const subscription = new aws.cloudwatch.EventRuleEventSubscription(
  `laundry-lambdaforMainGet-warming-subscription`,
  eventRule,
  lambda as any,
);
