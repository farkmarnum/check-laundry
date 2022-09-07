import CertWithValidation from './components/CertWithValidation';
import { DOMAIN } from './config';

const certWithValidation = new CertWithValidation('mainCert', {
  domain: DOMAIN,
});

export const { certificateArn, zoneId } = certWithValidation;
