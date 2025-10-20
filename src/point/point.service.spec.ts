import { NegativePointError } from '../common/errors/negative-point.error';
import { UserPointTable } from '../database/userpoint.table';
import { PointService } from './point.service';

describe('PointService', () => {
  let pointService: PointService;
  let userPointTable: UserPointTable;

  beforeEach(() => {
    userPointTable = new UserPointTable();
    pointService = new PointService(userPointTable);
  });

  describe('getPoint', () => {
    it("should return user's point information", async () => {
      // 특정 유저의 포인트 정보를 조회한다.
      // 포인트 정보 업데이트 시점을 mock
      const updatedAt = new Date();

      const userPoint = {
        id: 1,
        point: 0,
        updateMillis: updatedAt.getTime(),
      };

      jest
        .spyOn(userPointTable, 'selectById')
        .mockImplementation(async () => userPoint);

      const pointInfo = await pointService.getPoint({ userId: userPoint.id });

      expect(pointInfo).toStrictEqual({ ...userPoint });
    });

    it("should return each user's update time, as users have different update times", async () => {
      // 서로 다른 업데이트 시점을 가지는 유저는 각자의 업데이트 시점이 반환되어야 한다.
      const userPoints = [
        {
          id: 1,
          point: 0,
          updateMillis: new Date('2025-10-18').getTime(),
        },
        {
          id: 2,
          point: 0,
          updateMillis: new Date('2025-10-17').getTime(),
        },
      ];

      jest
        .spyOn(userPointTable, 'selectById')
        .mockImplementation(async (userId: number) =>
          userPoints.find((userPoint) => userPoint.id === userId),
        );

      const firstUserPointInfo = await pointService.getPoint({
        userId: userPoints[0].id,
      });

      const secondUserPointInfo = await pointService.getPoint({
        userId: userPoints[1].id,
      });

      expect(firstUserPointInfo.updateMillis).not.toEqual(
        secondUserPointInfo.updateMillis,
      );
    });
  });

  describe('charge', () => {
    it('should charge points for a user', async () => {
      // 특정 유저에게 포인트 적립을 할 수 있는지 테스트

      // 해당 테스트에서는 업데이트 시점은 테스트하지 않음
      const beforeUpdatedAt = new Date();
      const afterUpdatedAt = new Date();

      const userId = 1;
      const amount = 10;

      jest
        .spyOn(userPointTable, 'selectById')
        .mockImplementation(async (_userId: number) => ({
          id: _userId,
          point: 0,
          updateMillis: beforeUpdatedAt.getTime(),
        }));

      jest
        .spyOn(userPointTable, 'insertOrUpdate')
        .mockImplementation(async (_userId: number, _amount: number) => ({
          id: _userId,
          point: _amount,
          updateMillis: afterUpdatedAt.getTime(),
        }));

      const userPointInfo = await pointService.chargePoint(userId, amount);

      expect(userPointInfo).toStrictEqual({
        id: userId,
        point: amount,
        updateMillis: afterUpdatedAt.getTime(),
      });
    });

    it('should return 20 points after charging 10 points twice', async () => {
      // 10 포인트 적립 후 추가 10 포인트 적립 시 총 합 20 포인트 적립되었는지 확인
      const userId = 1;
      const amount = 10;

      // 업데이트 시점은 테스트하지 않음

      jest
        .spyOn(userPointTable, 'selectById')
        .mockImplementation(async (_userId: number) => ({
          id: _userId,
          point: 0, // 초기 값: 0
          updateMillis: new Date().getTime(),
        }));

      jest
        .spyOn(userPointTable, 'insertOrUpdate')
        .mockImplementation(async (_userId: number, _amount: number) => ({
          id: _userId,
          point: _amount, // 첫 포인트 적립 시: 10 포인트, 두 번째 포인트 적립 시: 20 포인트
          updateMillis: new Date().getTime(),
        }));

      await pointService.chargePoint(userId, amount);

      jest
        .spyOn(userPointTable, 'selectById')
        .mockImplementation(async (_userId: number) => ({
          id: _userId,
          point: amount, // 포인트 조회: 10 포인트
          updateMillis: new Date().getTime(),
        }));

      const userPointInfo = await pointService.chargePoint(userId, amount);

      expect(userPointInfo).toHaveProperty('point', 20);
    });

    it('should throw an error when attempting to charge a negative point value', async () => {
      // 음의 포인트 값으로 충전을 시도하면 에러가 발생해야 함
      jest
        .spyOn(userPointTable, 'selectById')
        .mockImplementation(async (_userId: number) => ({
          id: _userId,
          point: 0, // 초기 값: 0
          updateMillis: new Date().getTime(),
        }));

      jest
        .spyOn(userPointTable, 'insertOrUpdate')
        .mockImplementation(async (_userId: number, _amount: number) => ({
          id: _userId,
          point: _amount, // 첫 포인트 적립 시: 10 포인트, 두 번째 포인트 적립 시: 20 포인트
          updateMillis: new Date().getTime(),
        }));

      await expect(async () => {
        return await pointService.chargePoint(1, -10);
      }).rejects.toThrow(
        new NegativePointError('음수 포인트는 적립할 수 없습니다.'),
      );
    });
  });

  describe('use', () => {
    it('should deduct 5 points from user with 10 points, resulting in 5 points', async () => {
      // 유저가 가진 10 포인트에서 5포인트 차감 시 5포인트가 되어야 함.
      const userId = 1;
      const initialPointInfo = {
        id: userId,
        point: 10,
        updateMillis: new Date().getTime(),
      };

      jest.spyOn(userPointTable, 'selectById').mockImplementation(async () => {
        return initialPointInfo;
      });

      jest
        .spyOn(userPointTable, 'insertOrUpdate')
        .mockImplementation(async (_userId: number, _amount: number) => ({
          id: _userId,
          point: _amount, // 첫 포인트 적립 시: 10 포인트, 두 번째 포인트 적립 시: 20 포인트
          updateMillis: new Date().getTime(),
        }));

      const deductPointInfo = await pointService.usePoint(userId, 5);

      expect(deductPointInfo).toHaveProperty('point', 5);
    });

    it('should throw an error when attempting to use a negative point value', async () => {
      // 음수 포인트 차감 불가
      const userId = 1;
      const initialPointInfo = {
        id: userId,
        point: 10,
        updateMillis: new Date().getTime(),
      };

      jest.spyOn(userPointTable, 'selectById').mockImplementation(async () => {
        return initialPointInfo;
      });

      jest
        .spyOn(userPointTable, 'insertOrUpdate')
        .mockImplementation(async (_userId: number, _amount: number) => ({
          id: _userId,
          point: _amount,
          updateMillis: new Date().getTime(),
        }));

      await expect(async () => {
        return await pointService.usePoint(userId, -1);
      }).rejects.toThrow(
        new NegativePointError('음수 포인트는 사용할 수 없습니다.'),
      );
    });
  });
});
