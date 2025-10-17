import { Injectable } from '@nestjs/common';
import { UserPoint } from './point.model';

@Injectable()
export class PointService {
  public pointInfos: { [userId: number]: UserPoint } = {};

  getPoint({ userId }: { userId: number }) {
    return {
      id: this.pointInfos[userId].id,
      point: this.pointInfos[userId].point,
      updateMillis: this.pointInfos[userId].updateMillis,
    };
  }
}
