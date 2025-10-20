import { Injectable } from '@nestjs/common';
import { UserPointTable } from '../database/userpoint.table';

@Injectable()
export class PointService {
  private userPoint: number = 0;

  constructor(private readonly userPointTable: UserPointTable) {}

  async getPoint({ userId }: { userId: number }) {
    const userPoint = await this.userPointTable.selectById(userId);

    return {
      id: userPoint.id,
      point: userPoint.point,
      updateMillis: userPoint.updateMillis,
    };
  }

  chargePoint(userId: number, amount: number) {
    this.userPoint += amount;

    return {
      id: userId,
      point: this.userPoint,
      updateMillis: new Date().getTime(),
    };
  }
}
