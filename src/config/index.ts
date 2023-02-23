import * as path from 'path';

import { Config } from './config.interface';

export const configFactory = (): Config => {
  return {
    graphql: {
      playgroundEnabled: process.env?.PLAYGROUND_ENABLED ? Boolean(process.env.PLAYGROUND_ENABLED === 'true') : false,
      introspection: process.env?.GRAPHQL_INTROSPECTION ? Boolean(process.env.GRAPHQL_INTROSPECTION === 'true') : false,
      debug: true,
      schemaDestination: path.resolve(process.cwd(), 'src', 'schema.graphql'),
      sortSchema: true,
    },
    security: {
      JWTSecret: process.env.JWT_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN || '2m',
      refreshIn: '7d',
      bcryptSaltOrRound: 10,
    },
    minio: {
      endpoint: process.env.MINIO_ENDPOINT,
      port: Number.parseInt(process.env?.MINIO_PORT || '9000', 10),
      rootUser: process.env.MINIO_ROOT_USER,
      rootPassword: process.env.MINIO_ROOT_PASSWORD,
      region: process.env.MINIO_REGION_NAME,
      bucket: process.env.MINIO_BUCKET,
    },
  };
};
