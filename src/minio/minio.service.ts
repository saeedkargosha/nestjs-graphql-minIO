import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MinioConfig } from 'src/config/config.interface';
import { BufferedFile } from './models/file.model';
import type { ReadStream } from 'fs';
import { stream2buffer } from 'src/utils/general';

@Injectable()
export class MinioClientService {
  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<MinioConfig>('minio').bucket;
    this.region = this.configService.get<MinioConfig>('minio').region;
  }

  private readonly bucketName: string;
  private readonly region: string;

  public get client(): Client {
    return new Client({
      endPoint: this.configService.get<MinioConfig>('minio').endpoint,
      port: this.configService.get<MinioConfig>('minio').port,
      accessKey: this.configService.get<MinioConfig>('minio').rootUser,
      secretKey: this.configService.get<MinioConfig>('minio').rootPassword,
      useSSL: false,
    });
  }

  async init(): Promise<void> {
    const isBucketExist = await this.client.bucketExists(this.bucketName);

    if (!isBucketExist) {
      await this.client.makeBucket(this.bucketName, this.region);
    }
  }

  public async upload(file: BufferedFile): Promise<string> {
    if (!(file.mimetype.includes('png') || file.mimetype.includes('webp'))) {
      throw new HttpException('File type not supported', HttpStatus.BAD_REQUEST);
    }
    const metaData = {
      'Content-Type': file.mimetype,
    };

    try {
      await this.client.putObject(this.bucketName, file.filename, file.buffer, metaData);
    } catch {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }

    return file.filename;
  }

  public async getObject(objectName: string): Promise<Buffer> {
    try {
      await this.client.statObject(this.bucketName, objectName);
    } catch {
      throw new NotFoundException('Object not found in MinIo');
    }
    const objectStream = await this.client.getObject(this.bucketName, objectName);
    return stream2buffer(objectStream as ReadStream);
  }

  async delete(objectNames: string[]): Promise<void> {
    try {
      await this.client.removeObjects(this.bucketName, objectNames);
    } catch {
      throw new HttpException('An error occured when deleting!', HttpStatus.BAD_REQUEST);
    }
  }
}
