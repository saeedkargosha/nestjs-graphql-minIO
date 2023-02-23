import type { OnModuleInit } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { MinioClientService } from './minio.service';

@Global()
@Module({
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule implements OnModuleInit {
  constructor(private readonly minioService: MinioClientService) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.minioService.init();
    } catch (error) {
      console.trace('minio crash');
      console.error(error);
    }
  }
}
