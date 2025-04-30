/**
 * Mapping databases that connect symptoms and goals to specific recommendations
 * Used by the recommendation engine to enhance scoring relevance
 */

// Map specific symptoms to the most relevant supplement recommendations
export const SYMPTOM_RECOMMENDATIONS: Record<string, string[]> = {
  "fatigue": ["vitamin-b-complex", "coq10", "iron", "vitamin-d-supplement"],
  "stress": ["adaptogenic-herbs", "magnesium-glycinate", "mindfulness-meditation", "omega3-supplementation"],
  "anxiety": ["adaptogenic-herbs", "magnesium-glycinate", "mindfulness-meditation", "vitamin-b-complex"],
  "sleep_issues": ["magnesium-glycinate", "circadian-rhythm-optimization", "mindfulness-meditation"],
  "digestion": ["probiotics-daily", "digestive-enzymes", "anti-inflammatory-diet", "zinc-carnosine"],
  "joint_pain": ["omega3-supplementation", "curcumin", "anti-inflammatory-diet", "collagen-peptides"],
  "skin_problems": ["omega3-supplementation", "vitamin-e", "zinc", "probiotics-daily"],
  "immunite": ["vitamin-d-supplement", "zinc", "vitamin-c", "probiotics-daily"],
  "weak_immune_system": ["vitamin-d-supplement", "zinc", "vitamin-c", "echinacea"]
};

// Map specific health goals to the most relevant supplement recommendations
export const GOAL_RECOMMENDATIONS: Record<string, string[]> = {
  "energy": ["vitamin-b-complex", "coq10", "iron", "circadian-rhythm-optimization"],
  "sleep_improvement": ["magnesium-glycinate", "circadian-rhythm-optimization", "mindfulness-meditation"],
  "digestion": ["probiotics-daily", "digestive-enzymes", "anti-inflammatory-diet", "glutamine"],
  "immune_boost": ["vitamin-d-supplement", "zinc", "vitamin-c", "probiotics-daily"],
  "mental_clarity": ["omega3-supplementation", "vitamin-b-complex", "adaptogenic-herbs", "phosphatidylserine"],
  "stress_management": ["adaptogenic-herbs", "magnesium-glycinate", "mindfulness-meditation", "omega3-supplementation"]
};

// Dietary pattern recommendations
export const DIETARY_RECOMMENDATIONS: Record<string, string[]> = {
  "processed": ["anti-inflammatory-diet", "micronutrient-assessment", "probiotics-daily"],
  "low_variety": ["micronutrient-assessment", "vitamin-d-supplement", "vitamin-b-complex"],
  "irregular_meals": ["intermittent-fasting", "nutrient-timing", "circadian-rhythm-optimization"],
  "high_sugar": ["anti-inflammatory-diet", "intermittent-fasting", "chromium-picolinate"]
};

// Protein consumption recommendations
export const PROTEIN_RECOMMENDATIONS: Record<string, string[]> = {
  "low": ["plant-protein-blend", "micronutrient-assessment", "vitamin-b-complex"],
  "moderate": ["digestive-enzymes", "probiotics-daily", "nutrient-timing"],
  "high": ["kidney-support-herbs", "micronutrient-assessment", "digestive-enzymes"]
};

// Mapping of symptoms to relevant supplement IDs
export const SYMPTOM_RECOMMENDATIONS_OLD: Record<string, string[]> = {
  // Energy & Fatigue
  "Fatigue": ["vitamin_b_complex", "iron_complex", "vitamin_d3", "coq10-supplement"],

  // Sleep Issues
  "Sleep disorders": ["magnesium_glycinate", "melatonin", "l_theanine", "herbal-sleep-formula"],
  "Sleep issues": ["magnesium_glycinate", "melatonin", "l_theanine", "herbal-sleep-formula"],

  // Stress & Mood
  "Stress": ["ashwagandha", "magnesium_glycinate", "rhodiola", "l_theanine"],
  "Anxiety": ["l_theanine", "magnesium_glycinate", "ashwagandha", "cbd-oil"],
  "Mood swings": ["omega3", "vitamin_d3", "5-htp", "saffron-extract"],

  // Digestive Issues
  "Digestive problems": ["probiotics", "digestive-enzymes", "fiber-supplement", "l-glutamine"],
  "Bloating": ["digestive-enzymes", "probiotics", "peppermint-oil", "ginger-extract"],
  "Irregular bowel movements": ["probiotics", "fiber-supplement", "magnesium_glycinate"],

  // Pain & Inflammation
  "Joint pain": ["omega3", "curcumin-complex", "glucosamine-chondroitin", "collagen-peptides"],
  "Joint Pain": ["omega3", "curcumin-complex", "glucosamine-chondroitin", "collagen-peptides"],
  "JointPain": ["omega3", "curcumin-complex", "glucosamine-chondroitin", "collagen-peptides"],
  "Muscle aches": ["magnesium_glycinate", "curcumin-complex", "vitamin_d3"],
  "Headaches": ["magnesium_glycinate", "coq10-supplement", "feverfew-extract"],

  // Immune System
  "Weak immune system": ["vitamin_d3", "vitamin_c_complex", "zinc-complex", "probiotics"],
  "Frequent illness": ["vitamin_d3", "vitamin_c_complex", "zinc-complex", "elderberry-extract"],

  // Skin Issues
  "Skin problems": ["omega3", "vitamin_d3", "zinc-complex", "collagen-peptides"],
  "Acne": ["zinc-complex", "probiotics", "vitamin_a", "evening-primrose-oil"],
  "Dry skin": ["omega3", "omega3_algae", "vitamin_e", "collagen-peptides"],

  // Brain Function
  "Brain fog": ["omega3", "vitamin_b_complex", "rhodiola", "lion's-mane-mushroom"],
  "Poor concentration": ["rhodiola", "l_theanine", "bacopa-monnieri", "ginkgo-biloba"],
  "Memory issues": ["vitamin_b12", "bacopa-monnieri", "ginkgo-biloba", "phosphatidylserine"],

  // Women's Health
  "Menstrual discomfort": ["magnesium_glycinate", "vitamin_b_complex", "evening-primrose-oil", "dong-quai"],
  "Menopause symptoms": ["black-cohosh", "evening-primrose-oil", "magnesium_glycinate", "vitamin_e"],

  // Men's Health
  "Prostate concerns": ["saw-palmetto", "pygeum", "zinc-complex", "lycopene"],
  "Low testosterone": ["vitamin_d3", "zinc-complex", "ashwagandha", "magnesium_glycinate"],

  // Metabolic Health
  "Blood sugar fluctuations": ["chromium-picolinate", "berberine", "magnesium_glycinate", "alpha-lipoic-acid"],
  "Weight management challenges": ["metabolism-support", "fiber-supplement", "green-tea-extract", "cla-supplement"]
};

// Mapping of health goals to relevant supplement IDs
export const GOAL_RECOMMENDATIONS_OLD: Record<string, string[]> = {
  // Energy & Performance
  "More energy": ["vitamin_b_complex", "rhodiola", "coq10-supplement", "iron_complex"],
  "Athletic performance": ["creatine-monohydrate", "beta-alanine", "bcaa-complex", "electrolyte-formula"],
  "Workout recovery": ["magnesium_glycinate", "collagen-peptides", "tart-cherry-extract", "l-glutamine"],

  // Mental & Cognitive
  "Better focus": ["rhodiola", "l_theanine", "bacopa-monnieri", "lion's-mane-mushroom"],
  "Memory support": ["bacopa-monnieri", "vitamin_b12", "ginkgo-biloba", "phosphatidylserine"],
  "Stress management": ["ashwagandha", "l_theanine", "rhodiola", "magnesium_glycinate"],

  // Sleep & Relaxation
  "Better sleep": ["melatonin", "magnesium_glycinate", "l_theanine", "herbal-sleep-formula"],
  "Relaxation": ["l_theanine", "magnesium_glycinate", "lavender-extract", "lemon-balm-extract"],

  // Digestive Health
  "Support my digestion": ["probiotics", "digestive-enzymes", "fiber-supplement", "l-glutamine"],
  "Gut health": ["probiotics", "l-glutamine", "marshmallow-root", "slippery-elm-bark"],

  // Immune System
  "Strengthen my immunity": ["vitamin_d3", "vitamin_c_complex", "zinc-complex", "elderberry-extract"],
  "Winter wellness": ["vitamin_d3", "echinacea-complex", "elderberry-extract", "vitamin_c_complex"],

  // Longevity & Aging
  "Healthy aging": ["omega3", "coq10-supplement", "resveratrol", "vitamin_d3"],
  "Antioxidant support": ["vitamin_c_complex", "resveratrol", "astaxanthin", "glutathione"],

  // Heart & Circulatory
  "Heart health": ["omega3", "coq10-supplement", "garlic-extract", "plant-sterols"],
  "Circulatory support": ["ginkgo-biloba", "horse-chestnut-extract", "grape-seed-extract", "vitamin_e"],

  // Weight Management
  "Weight management": ["metabolism-support", "fiber-supplement", "green-tea-extract", "protein-powder"],
  "Balanced metabolism": ["chromium-picolinate", "alpha-lipoic-acid", "iodine-complex", "metabolism-support"],

  // Specialty Goals
  "Pregnancy support": ["prenatal-multivitamin", "omega3_algae", "iron_complex", "probiotic-prenatal"],
  "Hair, skin & nails": ["biotin-complex", "collagen-peptides", "silica", "vitamin_e"],
  "Bone strength": ["calcium-complex", "vitamin_d3", "vitamin_k2", "boron"]
};

// Mappings of symptoms to categories
export const SYMPTOM_CATEGORIES = {
  "Fatigue": ["energy", "nutrition"],
  "Sleep disorders": ["sleep", "relaxation"],
  "Stress": ["stress", "relaxation", "mood"],
  "Anxiety": ["mood", "relaxation"],
  "Digestive problems": ["digestion", "gut-health"],
  "Joint pain": ["joints", "anti-inflammatory"],
  "Skin problems": ["skin", "antioxidant"],
  "Brittle hair": ["hair", "nutrition"],
  "Weak immune system": ["immune", "antioxidant"],
  "Concentration issues": ["brain", "cognitive"],
  "Hormonal problems": ["hormonal", "balance"]
};


// Mappings of goals to recommended supplements
export const GOAL_RECOMMENDATIONS_OLD_2 = {
  "Better sleep": ["magnesium_glycinate", "melatonin", "l_theanine", "circadian-rhythm-optimization"],
  "Reduce my stress": ["ashwagandha", "rhodiola", "l_theanine", "mindfulness-meditation"],
  "More energy": ["vitamin_b_complex", "iron", "coq10", "vitamin_c"],
  "Strengthen my immunity": ["vitamin_c", "vitamin_d3", "zinc", "probiotics"],
  "Support my digestion": ["probiotics", "anti-inflammatory-diet", "magnesium_glycinate"],
  "Improve my concentration": ["omega3", "vitamin_b_complex", "l_theanine", "lions_mane", "alpha_gpc"],
  "Balance my hormones": ["vitamin_d3", "magnesium_glycinate", "omega3", "ashwagandha"],
  "Improve my skin": ["vitamin_c", "omega3", "zinc", "anti-inflammatory-diet"],
  "Balance my weight": ["intermittent-fasting", "berberine", "magnesium_glycinate", "nutrient-timing"],
  "Optimize my overall health": ["micronutrient-assessment", "vitamin_d3", "magnesium_glycinate", "omega3-supplementation", "probiotics"]
};

// Mappings of lifestyle habits to recommended supplements
export const LIFESTYLE_RECOMMENDATIONS = {
  "Sedentary": ["vitamin_d3", "magnesium_glycinate", "vitamin_b_complex"],
  "Active": ["magnesium_glycinate", "vitamin_c", "coq10"],
  "Very active": ["magnesium_glycinate", "vitamin_b_complex", "vitamin_c", "zinc", "coq10"],
  "Vegetarian diet": ["vitamin_b12", "iron", "vitamin_d3", "omega3"],
  "Vegan diet": ["vitamin_b12", "vitamin_d3", "iron", "omega3_vegan", "zinc"],
  "Chronic stress": ["ashwagandha", "rhodiola", "magnesium_glycinate", "vitamin_b_complex"],
  "Sleep disorders": ["magnesium_glycinate", "melatonin", "l_theanine"]
};

// Age factors for recommendation adjustments
export const AGE_FACTORS = {
  "18-30": {
    "vitamin_d3": 0.8,
    "vitamin_b_complex": 0.9,
    "magnesium_glycinate": 0.9,
    "probiotics": 1.0,
    "ashwagandha": 1.1
  },
  "31-45": {
    "vitamin_d3": 1.0,
    "vitamin_b_complex": 1.0,
    "magnesium_glycinate": 1.0,
    "coq10": 1.1,
    "probiotics": 1.0
  },
  "46-60": {
    "vitamin_d3": 1.2,
    "vitamin_b_complex": 1.1,
    "magnesium_glycinate": 1.1,
    "coq10": 1.2,
    "omega3": 1.2
  },
  "60+": {
    "vitamin_d3": 1.3,
    "vitamin_b_complex": 1.2,
    "magnesium_glycinate": 1.2,
    "coq10": 1.3,
    "omega3": 1.3
  }
};

// Gender factors for recommendation adjustments
export const GENDER_FACTORS = {
  "Male": {
    "zinc": 1.1,
    "vitamin_b_complex": 1.0,
    "magnesium_glycinate": 1.1
  },
  "Female": {
    "iron": 1.2,
    "vitamin_d3": 1.1,
    "calcium": 1.1
  }
};

// Symptom priority factors
export const SYMPTOM_PRIORITY_FACTORS = {
  "Fatigue": 1.2,
  "Sleep disorders": 1.2,
  "Stress": 1.1,
  "Anxiety": 1.1,
  "Digestive problems": 1.0,
  "Joint pain": 1.0,
  "Skin problems": 0.9,
  "Brittle hair": 0.9,
  "Weak immune system": 1.1
};