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

  async chargePoint(userId: number, amount: number) {
    const userPoint = await this.getPoint({ userId });

    const updatedUserPoint = await this.userPointTable.insertOrUpdate(
      userPoint.id,
      userPoint.point + amount,
    );

    return {
      id: updatedUserPoint.id,
      point: updatedUserPoint.point,
      updateMillis: updatedUserPoint.updateMillis,
    };
  }
}
