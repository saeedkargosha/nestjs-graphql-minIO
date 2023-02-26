import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './models/user.model';
import { FileUpload } from 'graphql-upload/Upload';
import { MinioClientService } from 'src/minio/minio.service';
import { NotAcceptableException } from '@nestjs/common/exceptions';
import { stream2buffer } from 'src/utils/general';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => MinioClientService))
    private minioService: MinioClientService,
  ) {}

  async getUser(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async uplaodAvatar(user: User, media: FileUpload): Promise<User> {
    if (!media.createReadStream) {
      throw new NotAcceptableException('The request method to upload file is invalid.');
    }
    const mediaBuffer = await stream2buffer(media.createReadStream() as any);
    const filename = await this.minioService.upload({
      ...media,
      buffer: mediaBuffer,
    });

    const foundUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        avatar: filename,
      },
    });
    return {
      ...foundUser,
      avatar: filename,
    };
  }
}
