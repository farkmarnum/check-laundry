import * as cloud from '@pulumi/cloud-aws';

export const bucket = new cloud.Bucket('check-laundry-storage');

export const bucketId = bucket.bucket.id;
