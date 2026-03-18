import { demoAchievements, demoRestaurant, demoSaveState, demoSections, demoStudent, scenarios } from "@/lib/game/content";

export function getStudentDashboardData() {
  return {
    student: demoStudent,
    sections: demoSections,
    restaurant: demoRestaurant,
    currentScenario: scenarios.find((scenario) => scenario.slug === demoSaveState.scenarioSlug) ?? scenarios[0],
    achievements: demoAchievements,
    saveState: demoSaveState
  };
}

export function getScenarioBySlug(slug: string) {
  return scenarios.find((scenario) => scenario.slug === slug);
}
