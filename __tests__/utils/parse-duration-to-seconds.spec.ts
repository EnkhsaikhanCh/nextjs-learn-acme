import { parseDurationToSeconds } from "@/utils/parseDurationToSeconds";

describe("parseDurationToSeconds", () => {
  it("parses MM:SS correctly", () => {
    expect(parseDurationToSeconds("05:30")).toBe(330);
    expect(parseDurationToSeconds("00:00")).toBe(0);
    expect(parseDurationToSeconds("12:45")).toBe(765);
  });

  it("parses HH:MM:SS correctly", () => {
    expect(parseDurationToSeconds("01:00:00")).toBe(3600);
    expect(parseDurationToSeconds("02:30:15")).toBe(9015);
  });

  it("returns 0 for invalid format", () => {
    expect(parseDurationToSeconds("")).toBe(0);
    expect(parseDurationToSeconds("invalid")).toBe(0);
    expect(parseDurationToSeconds("99")).toBe(0);
  });

  it("handles edge cases safely", () => {
    expect(parseDurationToSeconds("00:00:60")).toBe(60);
    expect(parseDurationToSeconds("60:00")).toBe(3600); // 60m = 3600s
  });
});
