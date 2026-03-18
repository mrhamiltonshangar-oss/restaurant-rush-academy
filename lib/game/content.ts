import {
  Achievement,
  RestaurantProfile,
  SaveState,
  Scenario,
  SectionSummary,
  StationConfig,
  TeacherDashboardData,
  UserProfile
} from "@/types/game";

export const demoTeacher: UserProfile = {
  id: "teacher-demo",
  firstName: "Chef Avery",
  email: "chef.teacher@school.edu",
  role: "teacher"
};

export const demoStudent: UserProfile = {
  id: "student-demo",
  firstName: "Jamie",
  email: "jamie.student@school.edu",
  role: "student"
};

export const demoSections: SectionSummary[] = [
  {
    id: "sec-1",
    name: "Period 2 Culinary",
    className: "Restaurant Rush Academy",
    classCode: "RRA-101",
    mode: "individual",
    unitUnlocks: ["orientation", "breakfast", "baking", "safety"]
  },
  {
    id: "sec-2",
    name: "Period 5 FCS Lab",
    className: "Restaurant Rush Academy",
    classCode: "RRA-205",
    mode: "team",
    unitUnlocks: ["orientation", "breakfast", "baking"]
  }
];

export const stationConfigs: Record<string, StationConfig> = {
  prep: {
    station: "prep",
    title: "Prep Station",
    cameraLabel: "Counter Cam",
    objective: "Organize ingredients, use safe knife cuts, and build mise en place before service starts.",
    successTip: "Consistency beats speed at prep. Smooth cuts and clean boards save panic later.",
    actions: [
      { id: "wash", label: "Wash Produce", description: "Sanitize produce before slicing.", impact: "safety", points: 15 },
      { id: "dice", label: "Dice Onion", description: "Keep finger tuck and even cuts.", impact: "quality", points: 18 },
      { id: "label", label: "Label Containers", description: "Store prepped items clearly.", impact: "safety", points: 10 },
      { id: "portion", label: "Portion Ingredients", description: "Measure ingredients before cooking.", impact: "speed", points: 12 }
    ]
  },
  line: {
    station: "line",
    title: "Line Station",
    cameraLabel: "Stove View",
    objective: "Sequence cooking, timing, and doneness checks while a ticket rail keeps filling up.",
    successTip: "Read the full ticket first, then fire proteins and sides in a staggered flow.",
    actions: [
      { id: "preheat", label: "Preheat Pan", description: "Start with the right heat.", impact: "quality", points: 10 },
      { id: "season", label: "Season Protein", description: "Build flavor before the sizzle.", impact: "quality", points: 12 },
      { id: "temp", label: "Check Doneness", description: "Use a thermometer cue.", impact: "safety", points: 18 },
      { id: "hold", label: "Coordinate Pick-Up", description: "Hold sides for proper timing.", impact: "speed", points: 15 }
    ]
  },
  baking: {
    station: "baking",
    title: "Baking Station",
    cameraLabel: "Oven Side",
    objective: "Measure, mix, and bake accurately while tracking time and texture clues.",
    successTip: "Baking loves order. Measure first, mix second, panic never.",
    actions: [
      { id: "measure", label: "Measure Flour", description: "Level the cup instead of packing it.", impact: "quality", points: 14 },
      { id: "cream", label: "Cream Butter + Sugar", description: "Watch for fluffy texture.", impact: "quality", points: 16 },
      { id: "rotate", label: "Rotate Tray", description: "Bake evenly and avoid hot spots.", impact: "speed", points: 10 },
      { id: "cool", label: "Cool Before Finish", description: "Prevent a melty mess.", impact: "presentation", points: 12 }
    ]
  },
  "front-of-house": {
    station: "front-of-house",
    title: "Front of House",
    cameraLabel: "Pass Window",
    objective: "Plate neatly, verify allergens, and hand off orders with calm communication.",
    successTip: "The guest only sees the final plate. Accuracy and confidence matter here.",
    actions: [
      { id: "wipe", label: "Wipe Plate Rim", description: "Clean edges improve presentation.", impact: "presentation", points: 8 },
      { id: "allergy", label: "Verify Allergen Ticket", description: "Pause and confirm the modification.", impact: "safety", points: 20 },
      { id: "garnish", label: "Add Garnish", description: "Use one purposeful finishing touch.", impact: "presentation", points: 10 },
      { id: "handoff", label: "Confident Handoff", description: "Call the order with clarity.", impact: "speed", points: 10 }
    ]
  }
};

const scenarioTitles = [
  "Kitchen Orientation",
  "Opening Day",
  "Breakfast Rush",
  "Baking Pop-Up",
  "Dairy and Egg Challenge",
  "Fruits and Vegetables Prep Sprint",
  "Meat and Poultry Safety Showdown",
  "Customer Complaint Recovery",
  "Equipment Breakdown Chaos",
  "Allergy-Safe Catering",
  "Team Service Showdown",
  "Final Restaurant Championship"
];

export const scenarios: Scenario[] = scenarioTitles.map((title, index) => {
  const slug = title.toLowerCase().replaceAll(" ", "-");
  const stationOrder = [
    "prep",
    index % 2 === 0 ? "line" : "baking",
    "front-of-house"
  ] as Scenario["stationOrder"];

  return {
    id: `scenario-${index + 1}`,
    slug,
    week: index + 1,
    title,
    subtitle: [
      "Learn the kitchen flow before the chaos finds you.",
      "Your tiny restaurant opens and the customers are already dramatic.",
      "Eggs are moving fast and toast waits for no one.",
      "Cupcakes, muffins, and one suspiciously competitive bake sale rival.",
      "Custards, omelets, and dairy timing with no room for guesswork.",
      "Knife skills, produce quality, and colorful station organization.",
      "Thermometers out. Cross-contamination villains, beware.",
      "A grumpy food critic appears. So does growth.",
      "The mixer quits mid-rush and the oven makes weird noises.",
      "Zero-allergen mistakes allowed. Calm, clear systems win.",
      "Paired service with shared saves, shared tickets, and shared glory.",
      "Everything comes together in one big end-of-term showdown."
    ][index],
    summary: "Story-driven service challenge with tutorials, flexible retries, and standards-aligned reflection.",
    difficulty: Math.min(5, Math.floor(index / 2) + 1) as 1 | 2 | 3 | 4 | 5,
    estimatedMinutes: index < 3 ? 12 : index < 8 ? 20 : 30,
    mode: index < 2 ? "tutorial" : index < 8 ? "guided" : "challenge",
    unitTag: ["orientation", "opening", "breakfast", "baking", "dairy-eggs", "produce", "meat-poultry", "recovery", "equipment", "allergy", "teamwork", "finale"][index],
    standardTags: ["FCS 8.1", "FCS 8.2", "FCS 8.3"],
    stationOrder,
    steps: [
      {
        id: `${slug}-brief`,
        title: "Briefing",
        description: "Review the customer goal, vocabulary, and success scaffold.",
        durationMinutes: 3,
        unlocks: ["story-dialogue", "vocab-popover"],
        vocabulary: ["mise en place", "sanitize", "ticket time"]
      },
      ...stationOrder.map((station, stepIndex) => ({
        id: `${slug}-${station}`,
        title: stationConfigs[station].title,
        description: stationConfigs[station].objective,
        station,
        durationMinutes: 5 + stepIndex * 2,
        vocabulary: ["timing", "quality", "safety"]
      })),
      {
        id: `${slug}-reflection`,
        title: "Reflection",
        description: "Capture what worked, what went weird, and what to try next.",
        durationMinutes: 4,
        vocabulary: ["reflection", "strategy", "improvement"]
      }
    ],
    reflectionPrompts: [
      { id: `${slug}-r1`, prompt: "Which kitchen choice helped your team most today?", standardTag: "FCS 8.1" },
      { id: `${slug}-r2`, prompt: "What safety or sanitation move would you repeat next time?", standardTag: "FCS 8.2" }
    ],
    goofyFeedback: [
      "The onions are diced, not emotionally processed. Nice recovery.",
      "Your whisk just entered its training montage era.",
      "That plating glow-up was legally impressive."
    ]
  };
});

export const demoRestaurant: RestaurantProfile = {
  id: "resto-demo",
  name: "Comet Skillet",
  theme: "fantasy-tavern",
  tagline: "Quest-grade comfort food.",
  cash: 1240,
  inventoryHealth: 81,
  staffMorale: 88,
  customerSatisfaction: 92,
  reputation: 74,
  stars: 14
};

export const demoAchievements: Achievement[] = [
  { id: "ach-1", title: "Board Warden", description: "Completed 5 prep tasks with zero sanitation misses.", category: "sanitation", unlocked: true },
  { id: "ach-2", title: "Brunch Survivor", description: "Beat Breakfast Rush with 80% satisfaction.", category: "speed", unlocked: true },
  { id: "ach-3", title: "Inventory Whisperer", description: "Finished a week with less than 5% waste.", category: "business", unlocked: false },
  { id: "ach-4", title: "Pass Window Hero", description: "Handled 3 allergy-safe orders correctly.", category: "story", unlocked: false }
];

export const demoTeacherDashboard: TeacherDashboardData = {
  teacher: demoTeacher,
  sections: [
    { id: "sec-1", name: "Period 2 Culinary", activeStudents: 28, avgCompletion: 62, avgMinutes: 87, sanitationHotspots: ["Handwashing", "Separate cutting boards"] },
    { id: "sec-2", name: "Period 5 FCS Lab", activeStudents: 31, avgCompletion: 56, avgMinutes: 73, sanitationHotspots: ["Labeling", "Glove changes"] }
  ],
  classAlerts: [
    { id: "alert-1", studentName: "Mia", scenarioTitle: "Breakfast Rush", reason: "Repeated timing issues at line station" },
    { id: "alert-2", studentName: "Noah", scenarioTitle: "Meat and Poultry Safety Showdown", reason: "3 sanitation flags on raw poultry handling" },
    { id: "alert-3", studentName: "Kai", scenarioTitle: "Baking Pop-Up", reason: "Stopped after measurement tutorial; likely needs guided mode" }
  ],
  standardsSnapshot: [
    { standard: "FCS 8.1 Kitchen safety", proficiency: 78 },
    { standard: "FCS 8.2 Food preparation", proficiency: 69 },
    { standard: "FCS 8.3 Career pathways", proficiency: 64 }
  ]
};

export const demoSaveState: SaveState = {
  id: "save-demo",
  userId: demoStudent.id,
  scenarioSlug: "breakfast-rush",
  stepId: "breakfast-rush-line",
  station: "line",
  checkpointLabel: "Ticket rail just started stacking up",
  progressPercent: 54,
  timerSecondsRemaining: 312,
  score: 141,
  businessDelta: {
    cash: 125,
    morale: 6,
    satisfaction: 9,
    reputation: 3
  },
  mistakes: ["Toast held too long", "Forgot to wipe plate rim"],
  updatedAt: new Date().toISOString()
};
