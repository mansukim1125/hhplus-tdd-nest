import { Injectable } from '@nestjs/common';

@Injectable()
export class PointService {
  public updatedAt: Date;

  getPoint({ userId }: { userId: number }) {
    return {
      id: userId,
      point: 0,
      updateMillis: this.updatedAt.getTime(),
    };
  }
}
