export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  introspection: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface SecurityConfig {
  JWTSecret: string;
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface MinioConfig {
  endpoint: string;
  port: number;
  rootUser: string;
  rootPassword: string;
  bucket: string;
  region: string;
}

export interface Config {
  graphql: GraphqlConfig;
  security: SecurityConfig;
  minio: MinioConfig;
}
