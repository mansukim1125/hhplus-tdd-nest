import { Injectable } from '@nestjs/common';

@Injectable()
export class PointService {
  getPoint({ userId }: { userId: number }) {
    return {
      id: userId,
      point: 0,
      updateMillis: new Date().getTime(),
    };
  }
}
