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
      const mockUpdatedAt = new Date();

      jest.useFakeTimers();
      jest.setSystemTime(mockUpdatedAt);

      const userId = 1;
      const amount = 10;
      const userPointInfo = await pointService.chargePoint(userId, amount);

      expect(userPointInfo).toStrictEqual({
        id: userId,
        point: amount,
        updateMillis: mockUpdatedAt.getTime(),
      });
    });
  });
});
