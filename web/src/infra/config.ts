import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config();
export const DOMAIN = config.require('DOMAIN');
export const API_KEY = config.requireSecret('API_KEY');
