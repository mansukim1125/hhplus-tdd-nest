import { Injectable } from '@nestjs/common';
import { UserPointTable } from '../database/userpoint.table';

@Injectable()
export class PointService {
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
    return {
      id: userId,
      point: amount,
      updateMillis: new Date().getTime(),
    };
  }
}
