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
  };
};
