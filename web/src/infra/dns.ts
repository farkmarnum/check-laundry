import * as aws from '@pulumi/aws';
import { DOMAIN } from './config';

import { cloudfrontDomainName, cloudfrontZoneId } from './api';
import { zoneId } from './cert';

export const apiDnsRecord = new aws.route53.Record('apiDnsRecord', {
  zoneId,
  type: 'A',
  name: DOMAIN,
  aliases: [
    {
      name: cloudfrontDomainName,
      evaluateTargetHealth: false,
      zoneId: cloudfrontZoneId,
    },
  ],
});
