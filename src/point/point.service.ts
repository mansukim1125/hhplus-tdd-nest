import { Injectable } from '@nestjs/common';
import { UserPointTable } from '../database/userpoint.table';
import { NegativePointError } from '../common/errors/negative-point.error';
import { NotEnoughPointError } from '../common/errors/not-enough-point.error';

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
    if (amount < 0)
      throw new NegativePointError('음수 포인트는 적립할 수 없습니다.');

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

  async usePoint(userId: number, amount: number) {
    if (amount < 0) {
      throw new NegativePointError('음수 포인트는 사용할 수 없습니다.');
    }

    const userPoint = await this.getPoint({ userId });

    if (userPoint.point < amount) {
      throw new NotEnoughPointError('포인트가 부족합니다.');
    }

    const updatedUserPoint = await this.userPointTable.insertOrUpdate(
      userPoint.id,
      userPoint.point - amount,
    );

    return {
      id: updatedUserPoint.id,
      point: updatedUserPoint.point,
      updateMillis: updatedUserPoint.updateMillis,
    };
  }
}
