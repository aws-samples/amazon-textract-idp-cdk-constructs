const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Martin Schade',
  authorAddress: '45048633+schadem@users.noreply.github.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'amazon-textract-idp-cdk-constructs',
  repositoryUrl: 'https://github.com/aws-samples/amazon-textract-idp-cdk-constructs.git',
  gitignore: ['test/__snapshots__/', '__pycache__', '.python-version', '.aws-sam', '.nvmrc', '.vscode', 'update_dependencies_local.sh', '.idea'],
  devDeps: ['aws-cdk-lib@^2.1.0'],
  peerDeps: ['aws-cdk-lib@^2.1.0'],
  keywords: ['aws-cdk', 'schadem', 'textract', 'amazon-textract', 'idp'],
  license: 'MIT-0',
  copyrightPeriod: '2022-',
  copyrightOwner: 'Amazon.com, Inc. or its affiliates. All Rights Reserved.',
  release: true,
  publishToPypi: {
    distName: 'amazon-textract-idp-cdk-constructs',
    module: 'amazon_textract_idp_cdk_constructs',
    prePublishSteps: [
      { run: 'mv dist .repo' },
      { run: 'cd .repo && yarn install --check-files --frozen-lockfile' },
      { run: 'python -m pip install --upgrade pip' },
      { run: 'pip install --upgrade setuptools' },
      { run: 'cd .repo && npx projen package:python' },
      { run: 'mv .repo/dist dist' },
    ],
  },
  python: {
    distName: 'amazon-textract-idp-cdk-constructs',
    module: 'amazon_textract_idp_cdk_constructs',
  },
  publishToMaven: {
    javaPackage: 'software.amazon.textract.idp',
    mavenArtifactId: 'idp-cdk-constructs',
    mavenGroupId: 'software.amazon.textract.idp',
    mavenServerId: 'ossrh',
    serverId: 'MavenCentral',
    mavenEndpoint: 'https://aws.oss.sonatype.org/',
    mavenRepositoryUrl: 'https://aws.oss.sonatype.org/',
  },
});
project.synth();
