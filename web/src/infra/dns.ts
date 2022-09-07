import * as aws from '@pulumi/aws';
import CertWithValidation from './components/CertWithValidation';
import { DOMAIN } from './config';

const certWithValidation = new CertWithValidation('mainCert', {
  domain: DOMAIN,
});

export const { certificateArn, zoneId } = certWithValidation;

const apiDomainName = new aws.apigateway.DomainName('apiDomainName', {
  certificateArn,
  domainName: DOMAIN,
});

export const apiDnsRecord = new aws.route53.Record('apiDnsRecord', {
  zoneId,
  type: 'A',
  name: DOMAIN,
  aliases: [
    {
      name: apiDomainName.cloudfrontDomainName,
      evaluateTargetHealth: false,
      zoneId: apiDomainName.cloudfrontZoneId,
    },
  ],
});
