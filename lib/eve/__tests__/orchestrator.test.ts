import { describe, expect, it } from "vitest";
import type { NatalChartResult } from "../natalChart";
import { runEveOrchestrator } from "../orchestrator";

const sampleChart: NatalChartResult = {
  name: "Eve Test",
  hasBirthTime: true,
  timezone: "America/Denver",
  planets: [
    {
      key: "chiron",
      label: "Chiron",
      sign: "Aries",
      degreeInSign: 12.3,
      longitude: 12.3,
      house: 1,
      retrograde: false,
    },
    {
      key: "lilith",
      label: "Black Moon Lilith",
      sign: "Scorpio",
      degreeInSign: 4.5,
      longitude: 214.5,
      house: 8,
      retrograde: true,
    },
  ],
  ascendant: { label: "Ascendant", sign: "Libra", degreeInSign: 2, longitude: 182 },
  midheaven: { label: "Midheaven", sign: "Cancer", degreeInSign: 4, longitude: 94 },
  houses: Array.from({ length: 12 }, (_, index) => ({
    house: index + 1,
    sign: "Aries",
    degreeInSign: index,
    longitude: index * 30,
  })),
  aspects: [],
};

describe("Eve orchestrator first slice", () => {
  it("runs wound-extract through the wound specialist and returns hits", async () => {
    const out = await runEveOrchestrator({
      tasks: [
        {
          id: "t1",
          kind: "wound-extract",
          payload: { chart: sampleChart },
        },
      ],
    });

    expect(out.results).toHaveLength(1);
    expect(out.results[0].status).toBe("ok");
    expect(out.results[0].specialist).toBe("wound");
    expect(Array.isArray(out.results[0].output)).toBe(true);
    expect((out.results[0].output as any[]).length).toBeGreaterThan(0);
    expect(out.summary).toContain("1 succeeded");
  });

  it("handles unknown task kind without crashing", async () => {
    const out = await runEveOrchestrator({
      tasks: [
        {
          id: "t2",
          kind: "portal-express" as any,
          payload: {},
        },
      ],
    });

    expect(out.results[0].status).toBe("error");
    expect(out.results[0].error).toContain("No specialist registered");
  });
});
