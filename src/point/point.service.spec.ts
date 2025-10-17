import { PointService } from './point.service';

describe('PointService', () => {
  let pointService: PointService;

  beforeEach(() => {
    pointService = new PointService();
  });

  describe('getPoint', () => {
    it("should return user's point information", () => {
      // 특정 유저의 포인트 정보를 조회한다.
      jest.useFakeTimers();
      jest.setSystemTime(new Date());

      // 포인트 정보 업데이트 시점을 mock
      pointService.updatedAt = new Date();

      const updatedAt = new Date();
      const userId = 1;

      const pointInfo = pointService.getPoint({ userId });

      expect(pointInfo).toStrictEqual({
        id: userId,
        point: 0,
        updateMillis: updatedAt.getTime(),
      });
    });
  });
});
