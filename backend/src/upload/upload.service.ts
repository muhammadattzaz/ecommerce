import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  private readonly imagesBase =
    (process.env.FRONTEND_URL_PUBLIC_IMAGES ?? 'http://localhost:3000/assets/images').replace(
      /\/+$/,
      '',
    );

  getFileUrl(filename: string): string {
    return `${this.imagesBase}/uploads/${filename}`;
  }
}
