import { scenarios } from "../lib/game/content";

console.log(
  JSON.stringify(
    {
      seededScenarios: scenarios.length,
      titles: scenarios.map((scenario) => scenario.title)
    },
    null,
    2
  )
);
