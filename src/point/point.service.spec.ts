describe('PointService', () => {
  let pointService: PointService;

  beforeEach(() => {
    pointService = new PointService();
  });

  describe('getPoint', () => {
    it("should return user's point information", () => {
      // 특정 유저의 포인트 정보를 조회한다.
      const userId = 1;

      const pointInfo = pointService.getPoint({ userId });

      expect(pointInfo).toBe({
        id: userId,
        point: 0,
        updateMillis: new Date().getTime(),
      });
    });
  });
});
