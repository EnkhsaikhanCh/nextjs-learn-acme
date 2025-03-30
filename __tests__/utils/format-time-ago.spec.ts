import { formatTimeAgo } from "../../src/utils/format-time-ago";

describe("formatTimeAgo", () => {
  const fixedDate = new Date("2025-03-29T12:00:00Z");

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('returns "саяхан" when less than 60 seconds have passed', () => {
    const thirtySecondsAgo = new Date(fixedDate.getTime() - 30 * 1000);
    expect(formatTimeAgo(thirtySecondsAgo)).toBe("саяхан");
  });

  test("returns minutes ago when less than 60 minutes have passed", () => {
    const fiveMinutesAgo = new Date(fixedDate.getTime() - 5 * 60 * 1000);
    expect(formatTimeAgo(fiveMinutesAgo)).toBe("5 минутын өмнө");
  });

  test("returns 1 минутын өмнө at exactly 60 seconds", () => {
    const exactlySixtySecondsAgo = new Date(fixedDate.getTime() - 60 * 1000);
    expect(formatTimeAgo(exactlySixtySecondsAgo)).toBe("1 минутын өмнө");
  });

  test("returns hours ago when less than 24 hours have passed", () => {
    const threeHoursAgo = new Date(fixedDate.getTime() - 3 * 60 * 60 * 1000);
    expect(formatTimeAgo(threeHoursAgo)).toBe("3 цагийн өмнө");
  });

  test("returns 1 цагийн өмнө at exactly 60 minutes", () => {
    const exactlySixtyMinutesAgo = new Date(
      fixedDate.getTime() - 60 * 60 * 1000,
    );
    expect(formatTimeAgo(exactlySixtyMinutesAgo)).toBe("1 цагийн өмнө");
  });

  test("returns days ago when 24 hours or more have passed", () => {
    const threeDaysAgo = new Date(
      fixedDate.getTime() - 3 * 24 * 60 * 60 * 1000,
    );
    expect(formatTimeAgo(threeDaysAgo)).toBe("3 өдрийн өмнө");
  });

  test("returns 1 өдрийн өмнө at exactly 24 hours", () => {
    const exactlyTwentyFourHoursAgo = new Date(
      fixedDate.getTime() - 24 * 60 * 60 * 1000,
    );
    expect(formatTimeAgo(exactlyTwentyFourHoursAgo)).toBe("1 өдрийн өмнө");
  });
});
