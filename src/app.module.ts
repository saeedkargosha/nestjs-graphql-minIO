import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DBModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { configFactory } from './config';
import { GraphQLModule, NumberScalarMode } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphqlConfig } from './config/config.interface';
import { MinioClientModule } from './minio/minio.module';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configFactory],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');
        return {
          buildSchemaOptions: {
            numberScalarMode: 'integer' as NumberScalarMode,
          },
          sortSchema: graphqlConfig?.sortSchema,
          autoSchemaFile: graphqlConfig?.schemaDestination || './src/schema.graphql',
          debug: graphqlConfig?.debug || false,
          introspection: graphqlConfig?.introspection || false,
          playground: graphqlConfig?.playgroundEnabled || false,
          context: ({ req }) => ({ req }),
        };
      },
      inject: [ConfigService],
    }),
    MinioClientModule,
    DBModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}
