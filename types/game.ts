export type Role = "teacher" | "student";
export type GameMode = "individual" | "team";
export type ScenarioMode = "tutorial" | "guided" | "challenge";
export type RestaurantTheme = "cafe" | "bakery" | "diner" | "food-truck" | "fantasy-tavern";
export type StationType = "prep" | "line" | "baking" | "front-of-house";

export interface UserProfile {
  id: string;
  firstName: string;
  email: string;
  role: Role;
}

export interface SectionSummary {
  id: string;
  name: string;
  className: string;
  classCode: string;
  mode: GameMode;
  unitUnlocks: string[];
}

export interface RestaurantProfile {
  id: string;
  name: string;
  theme: RestaurantTheme;
  tagline: string;
  cash: number;
  inventoryHealth: number;
  staffMorale: number;
  customerSatisfaction: number;
  reputation: number;
  stars: number;
}

export interface ReflectionPrompt {
  id: string;
  prompt: string;
  standardTag: string;
}

export interface StationAction {
  id: string;
  label: string;
  description: string;
  impact: "quality" | "speed" | "safety" | "presentation";
  points: number;
}

export interface StationConfig {
  station: StationType;
  title: string;
  cameraLabel: string;
  objective: string;
  actions: StationAction[];
  successTip: string;
}

export interface ScenarioStep {
  id: string;
  title: string;
  description: string;
  station?: StationType;
  durationMinutes: number;
  unlocks?: string[];
  vocabulary: string[];
}

export interface Scenario {
  id: string;
  slug: string;
  week: number;
  title: string;
  subtitle: string;
  summary: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  mode: ScenarioMode;
  unitTag: string;
  standardTags: string[];
  stationOrder: StationType[];
  steps: ScenarioStep[];
  reflectionPrompts: ReflectionPrompt[];
  goofyFeedback: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "sanitation" | "speed" | "teamwork" | "business" | "story";
  unlocked: boolean;
}

export interface StudentProgress {
  userId: string;
  currentScenarioSlug: string;
  completedScenarioIds: string[];
  currentStepId: string;
  totalMinutesPlayed: number;
  sanitationFlags: number;
  recipeMastery: Record<string, number>;
  saves: number;
  streak: number;
}

export interface TeacherDashboardData {
  teacher: UserProfile;
  sections: Array<{
    id: string;
    name: string;
    activeStudents: number;
    avgCompletion: number;
    avgMinutes: number;
    sanitationHotspots: string[];
  }>;
  classAlerts: Array<{
    id: string;
    studentName: string;
    scenarioTitle: string;
    reason: string;
  }>;
  standardsSnapshot: Array<{
    standard: string;
    proficiency: number;
  }>;
}

export interface SaveState {
  id: string;
  userId?: string;
  teamId?: string;
  scenarioSlug: string;
  stepId: string;
  station: StationType | null;
  checkpointLabel: string;
  progressPercent: number;
  timerSecondsRemaining: number;
  score: number;
  businessDelta: {
    cash: number;
    morale: number;
    satisfaction: number;
    reputation: number;
  };
  mistakes: string[];
  updatedAt: string;
}
