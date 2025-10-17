import { PointService } from './point.service';

describe('PointService', () => {
  let pointService: PointService;

  beforeEach(() => {
    pointService = new PointService();
  });

  describe('getPoint', () => {
    it("should return user's point information", () => {
      // 특정 유저의 포인트 정보를 조회한다.
      // 포인트 정보 업데이트 시점을 mock
      const updatedAt = new Date();
      pointService.updatedAt = updatedAt.getTime();

      const userId = 1;

      const pointInfo = pointService.getPoint({ userId });

      expect(pointInfo).toStrictEqual({
        id: userId,
        point: 0,
        updateMillis: updatedAt.getTime(),
      });
    });

    it("should return each user's update time, as users have different update times", () => {
      // 서로 다른 업데이트 시점을 가지는 유저는 각자의 업데이트 시점이 반환되어야 한다.
      // 포인트 정보 업데이트 시점을 mock

      const firstUser = {
        id: 1,
        point: 0,
        updateMillis: new Date('2025-10-18').getTime(),
      };

      const secondUser = {
        id: 1,
        point: 0,
        updateMillis: new Date('2025-10-17').getTime(),
      };

      pointService.updatedAt = firstUser.updateMillis;

      const firstUserPointInfo = pointService.getPoint({
        userId: firstUser.id,
      });

      pointService.updatedAt = secondUser.updateMillis;

      const secondUserPointInfo = pointService.getPoint({
        userId: secondUser.id,
      });

      expect(firstUserPointInfo).toStrictEqual({ ...firstUser });
      expect(secondUserPointInfo).toStrictEqual({ ...secondUser });

      const secondAttemptfirstUserPointInfo = pointService.getPoint({
        userId: firstUser.id,
      });

      expect(secondAttemptfirstUserPointInfo).toStrictEqual({ ...firstUser });
    });
  });
});
