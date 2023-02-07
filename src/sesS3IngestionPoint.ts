import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

interface SesS3IngestionPointProps {

  readonly s3OutputBucket:string;
  /** The prefix to use to output files to */
  readonly s3OutputPrefix:string;
}

export class SesS3IngestionPoint extends Construct {
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string, props?: SesS3IngestionPointProps) {
    super(scope, id);

    this.bucket = new Bucket(this, 'ses-s3-ingestion-point', {
      bucketName: props?.s3OutputBucket,
    });

    this.bucket.addToResourcePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:PutObject'],
      principals: [new ServicePrincipal('ses.amazonaws.com')],
      resources: [this.bucket.arnForObjects('*')],
    }));
  }
}