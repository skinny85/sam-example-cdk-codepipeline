#!/usr/bin/env node

import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SampleCdkAppStack } from '../lib/sample-cdk-app-stack';

const app = new cdk.App();
new SampleCdkAppStack(app, 'SampleCdkAppStack');
