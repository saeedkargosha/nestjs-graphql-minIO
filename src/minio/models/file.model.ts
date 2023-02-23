export interface BufferedFile {
  filename: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer | string;
}
