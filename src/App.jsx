import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Sparkles, ShoppingBasket, Shuffle, ChevronDown, ChevronUp, Check, X, Download,
  Flame, Beef, Wheat, Droplet, Dumbbell, Moon, Calendar, BookOpen, Search,
} from 'lucide-react';
import mealsMaster from './meals_master.json';

// ============================================================
// DATA LOADER — meals_master.json → slot-keyed arrays
// ============================================================

const SECTION_TO_SLOT = {
  'Pre Workout (Training Days Only)': 'preworkout',
  'Breakfast': 'breakfast',
  'Lunch': 'lunch',
  'Dinners': 'dinner',
  'Snacks (Pick One)': 'snack',
  'Snack 2': 'funSnack',
  'Desserts': 'dessert',
};

const SLOT_META = {
  preworkout: { label: 'Pre-workout', icon: '⚡', emojiBig: '⚡' },
  breakfast:  { label: 'Breakfast',   icon: '🌅', emojiBig: '🌅' },
  lunch:      { label: 'Lunch',       icon: '🥗', emojiBig: '🥗' },
  dinner:     { label: 'Dinner',      icon: '🍽️', emojiBig: '🍽️' },
  snack:      { label: 'Snack',       icon: '🥯', emojiBig: '🥯' },
  funSnack:   { label: 'Snack 2',     icon: '🍫', emojiBig: '🍫' },
  dessert:    { label: 'Dessert',     icon: '🍰', emojiBig: '🍰' },
};

// Build slot-keyed arrays from the master JSON.
// Each meal keeps its full schema (id, name, macros, ingredients[], method[]).
const MEALS = (() => {
  const out = { preworkout: [], breakfast: [], lunch: [], dinner: [], snack: [], funSnack: [], dessert: [] };
  for (const m of mealsMaster.meals) {
    const slot = SECTION_TO_SLOT[m.section];
    if (!slot) continue;
    out[slot].push(m);
  }
  return out;
})();

// ============================================================
// HELPERS
// ============================================================

const round = (n, dp = 0) => {
  const mul = Math.pow(10, dp);
  return Math.round(n * mul) / mul;
};

// Format an ingredient quantity for display.
const fmtQty = (qty, unit) => {
  if (qty === undefined || qty === null) {
    return unit === 'to_taste' ? 'to taste' : '';
  }
  if (unit === 'to_taste') return 'to taste';
  const q = qty < 10 ? round(qty, 1) : round(qty);
  if (unit === 'g' || unit === 'ml') return `${q}${unit}`;
  if (unit === 'tsp') return `${q} tsp`;
  if (unit === 'each' || !unit) return `${q}`;
  return `${q} ${unit}`;
};

// Find a meal by id across all slots (used for swap-by-id).
const findMealById = (id) => {
  for (const slot of Object.keys(MEALS)) {
    const m = MEALS[slot].find(x => x.id === id);
    if (m) return { meal: m, slot };
  }
  return null;
};

// Deterministic PRNG so seeded shuffles are reproducible.
function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Build a single day plan optimising for both calorie and protein targets.
// Score = (cal_diff / cal_tol)² + (protein_diff / protein_tol)²
function buildPlan(targetCal, targetProtein, includePreworkout, seed) {
  const rng = mulberry32(seed);
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];

  const calTol = 75;
  const proteinTol = 8;

  let best = null;
  for (let attempt = 0; attempt < 800; attempt++) {
    const pre = includePreworkout && MEALS.preworkout.length ? pick(MEALS.preworkout) : null;
    const b = MEALS.breakfast.length ? pick(MEALS.breakfast) : null;
    const l = MEALS.lunch.length ? pick(MEALS.lunch) : null;
    const d = MEALS.dinner.length ? pick(MEALS.dinner) : null;
    const s = MEALS.snack.length ? pick(MEALS.snack) : null;
    const f = MEALS.funSnack.length ? pick(MEALS.funSnack) : null;
    const ds = MEALS.dessert.length ? pick(MEALS.dessert) : null;

    const meals = [pre, b, l, d, s, f, ds].filter(Boolean);
    const totalCal = meals.reduce((sum, m) => sum + m.macros.calories, 0);
    const totalP = meals.reduce((sum, m) => sum + m.macros.protein, 0);

    const calScore = Math.pow((totalCal - targetCal) / calTol, 2);
    const pScore = Math.pow((totalP - targetProtein) / proteinTol, 2);
    const score = calScore + pScore;

    if (!best || score < best.score) {
      best = {
        preworkout: pre,
        breakfast: b, lunch: l, dinner: d, snack: s, funSnack: f, dessert: ds,
        totalCal, totalP, score,
      };
      if (score < 0.5) break;
    }
  }
  return best;
}

const PLAN_SLOTS = ['preworkout', 'breakfast', 'lunch', 'dinner', 'snack', 'funSnack', 'dessert'];

function planTotals(plan) {
  if (!plan) return { cal: 0, c: 0, f: 0, p: 0 };
  return PLAN_SLOTS.reduce((acc, slot) => {
    const m = plan[slot];
    if (!m) return acc;
    return {
      cal: acc.cal + m.macros.calories,
      c:   acc.c   + m.macros.carbs,
      f:   acc.f   + m.macros.fats,
      p:   acc.p   + m.macros.protein,
    };
  }, { cal: 0, c: 0, f: 0, p: 0 });
}

// Build shopping list. Respects `shopping: false` on pantry items.
// Normalises Banana / each / 1 → Banana with no unit so merging works.
function normaliseUnit(unit) {
  if (!unit || unit === 'each') return '';
  return unit;
}

function buildShoppingList(trainingPlan, restPlan, trainingDays, restDays) {
  const combined = {};
  const perMeal = [];

  const addMeals = (plan, dayCount, dayLabel) => {
    if (!plan || dayCount === 0) return;
    PLAN_SLOTS.forEach(slot => {
      const meal = plan[slot];
      if (!meal) return;
      const ingScaled = meal.ingredients
        .filter(i => i.shopping !== false)            // drop pantry items
        .filter(i => i.unit !== 'to_taste')           // drop to-taste items
        .map(i => ({
          name: i.name,
          qty: (i.qty || 0) * dayCount,
          unit: normaliseUnit(i.unit),
          note: i.note,
        }));
      perMeal.push({ mealName: meal.name, slot, dayLabel, dayCount, ingredients: ingScaled });
      ingScaled.forEach(i => {
        const key = `${i.name.toLowerCase().trim()}|${i.unit}`;
        if (!combined[key]) combined[key] = { name: i.name, qty: 0, unit: i.unit };
        combined[key].qty += i.qty;
      });
    });
  };

  addMeals(trainingPlan, trainingDays, 'Training');
  addMeals(restPlan, restDays, 'Rest');

  const combinedArr = Object.values(combined).sort((a, b) => a.name.localeCompare(b.name));
  return { combined: combinedArr, perMeal };
}

function applyOverrides(plan, overrides) {
  const out = { ...plan };
  for (const slot of Object.keys(overrides)) {
    const id = overrides[slot];
    const found = findMealById(id);
    if (found && found.slot === slot) out[slot] = found.meal;
  }
  return out;
}

// ============================================================
// REUSABLE HOOK — debounce a value
// ============================================================
function useDebounced(value, delay) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function App() {
  // -------- targets & day counts --------
  const [trainingCal, setTrainingCal]         = useState(2541);
  const [trainingProtein, setTrainingProtein] = useState(179);
  const [restCal, setRestCal]                 = useState(2188);
  const [restProtein, setRestProtein]         = useState(172);

  const [totalDays, setTotalDays]                 = useState(7);
  const [trainingDayCount, setTrainingDayCount]   = useState(5);

  // Clamp training days within total days
  useEffect(() => {
    if (trainingDayCount > totalDays) setTrainingDayCount(totalDays);
  }, [totalDays, trainingDayCount]);

  const restDayCount = Math.max(0, totalDays - trainingDayCount);

  // Debounce target sliders so the 800-attempt optimiser doesn't stutter on mobile
  const dTrainingCal     = useDebounced(trainingCal, 150);
  const dTrainingProtein = useDebounced(trainingProtein, 150);
  const dRestCal         = useDebounced(restCal, 150);
  const dRestProtein     = useDebounced(restProtein, 150);

  // -------- seeds & overrides --------
  const [trainingSeed, setTrainingSeed] = useState(1);
  const [restSeed, setRestSeed]         = useState(2);
  const [trainingOverrides, setTrainingOverrides] = useState({});
  const [restOverrides, setRestOverrides]         = useState({});

  // -------- UI state --------
  const [activeMode, setActiveMode] = useState('training');     // 'training' | 'rest'
  const [view, setView]             = useState('combined');     // 'combined' | 'perMeal'
  const [expanded, setExpanded]     = useState({});             // shopping list groups
  const [recipeOpen, setRecipeOpen] = useState({});             // per-slot recipe expand
  const [swapping, setSwapping]     = useState(null);           // slot key currently swapping
  const [swapSearch, setSwapSearch] = useState('');

  // -------- plans --------
  const baseTraining = useMemo(
    () => buildPlan(dTrainingCal, dTrainingProtein, true, trainingSeed),
    [dTrainingCal, dTrainingProtein, trainingSeed]
  );
  const baseRest = useMemo(
    () => buildPlan(dRestCal, dRestProtein, false, restSeed),
    [dRestCal, dRestProtein, restSeed]
  );

  const trainingPlan = useMemo(
    () => baseTraining ? applyOverrides(baseTraining, trainingOverrides) : null,
    [baseTraining, trainingOverrides]
  );
  const restPlan = useMemo(
    () => baseRest ? applyOverrides(baseRest, restOverrides) : null,
    [baseRest, restOverrides]
  );

  const tTotals = planTotals(trainingPlan);
  const rTotals = planTotals(restPlan);
  const weekCal     = tTotals.cal * trainingDayCount + rTotals.cal * restDayCount;
  const weekProtein = tTotals.p   * trainingDayCount + rTotals.p   * restDayCount;

  const { combined: shoppingCombined, perMeal: shoppingPerMeal } = useMemo(
    () => buildShoppingList(trainingPlan, restPlan, trainingDayCount, restDayCount),
    [trainingPlan, restPlan, trainingDayCount, restDayCount]
  );

  // -------- handlers --------
  const toggle = (key) => setExpanded(e => ({ ...e, [key]: !e[key] }));
  const toggleRecipe = (key) => setRecipeOpen(e => ({ ...e, [key]: !e[key] }));

  const currentPlan = activeMode === 'training' ? trainingPlan : restPlan;
  const currentSlots = activeMode === 'training'
    ? ['preworkout', 'breakfast', 'lunch', 'dinner', 'snack', 'funSnack', 'dessert']
    : ['breakfast', 'lunch', 'dinner', 'snack', 'funSnack', 'dessert'];
  const currentDayCount = activeMode === 'training' ? trainingDayCount : restDayCount;
  const currentDayLabel = activeMode === 'training' ? 'training' : 'rest';

  const swapMeal = (slot, mealId) => {
    if (activeMode === 'training') {
      setTrainingOverrides(o => ({ ...o, [slot]: mealId }));
    } else {
      setRestOverrides(o => ({ ...o, [slot]: mealId }));
    }
    setSwapping(null);
    setSwapSearch('');
  };

  const shuffleAll = () => {
    setTrainingOverrides({});
    setRestOverrides({});
    setTrainingSeed(s => s + 1);
    setRestSeed(s => s + 1);
  };

  const shuffleCurrent = () => {
    if (activeMode === 'training') {
      setTrainingOverrides({});
      setTrainingSeed(s => s + 1);
    } else {
      setRestOverrides({});
      setRestSeed(s => s + 1);
    }
  };

  const exportList = () => {
    const lines = [];
    lines.push(`MEAL PLAN & SHOPPING LIST — ${totalDays} day${totalDays > 1 ? 's' : ''}`);
    lines.push(`Training days × ${trainingDayCount}: target ${trainingCal} cal / ${trainingProtein}g protein · actual ${tTotals.cal} cal / ${tTotals.p}g`);
    if (restDayCount > 0)
      lines.push(`Rest days × ${restDayCount}: target ${restCal} cal / ${restProtein}g protein · actual ${rTotals.cal} cal / ${rTotals.p}g`);
    lines.push(`Period totals: ${weekCal.toLocaleString()} cal · ${weekProtein}g protein`);
    lines.push('');
    if (trainingDayCount > 0 && trainingPlan) {
      lines.push(`TRAINING DAY MEALS (×${trainingDayCount}):`);
      PLAN_SLOTS.forEach(slot => {
        const m = trainingPlan[slot];
        if (m) lines.push(`  ${SLOT_META[slot].label}: ${m.name} (${m.macros.calories} cal, ${m.macros.protein}g protein)`);
      });
      lines.push('');
    }
    if (restDayCount > 0 && restPlan) {
      lines.push(`REST DAY MEALS (×${restDayCount}):`);
      ['breakfast', 'lunch', 'dinner', 'snack', 'funSnack', 'dessert'].forEach(slot => {
        const m = restPlan[slot];
        if (m) lines.push(`  ${SLOT_META[slot].label}: ${m.name} (${m.macros.calories} cal, ${m.macros.protein}g protein)`);
      });
      lines.push('');
    }
    lines.push('COMBINED SHOPPING LIST:');
    shoppingCombined.forEach(i => lines.push(`  ☐ ${i.name} — ${fmtQty(i.qty, i.unit)}`));
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-plan-${totalDays}days.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------- styling tokens --------
  const C = {
    teal:     '#1a3a36',
    tealSoft: '#4a6864',
    mute:     '#7a9692',
    bgA:      '#c7e9e2',
    bgB:      '#f5e8e0',
    cream:    '#fbf6f1',
    accent:   '#f4b8b8',
    line:     '#eef3f1',
  };

  return (
    <div style={{
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      background: `linear-gradient(135deg, ${C.bgA} 0%, ${C.bgB} 100%)`,
      minHeight: '100vh',
      padding: '32px 16px',
      color: C.teal,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Pacifico&display=swap');
        .fade-in { animation: fadeIn 0.25s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        input[type="range"] { -webkit-appearance: none; width: 100%; height: 6px; background: #eef3f1; border-radius: 999px; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #1a3a36; cursor: pointer; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        input[type="range"]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #1a3a36; cursor: pointer; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        .btn:hover { filter: brightness(0.96); }
        .swap-btn:hover { background: #eef3f1 !important; }
      `}</style>

      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ---- HEADER ---- */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 36, color: C.teal, lineHeight: 1 }}>Fit with Jade</div>
          <div style={{ fontSize: 13, color: C.tealSoft, marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Meal Planner &amp; Shopping List</div>
        </div>

        {/* ---- TARGETS ---- */}
        <div style={{
          background: '#fff', borderRadius: 22, padding: 20, marginBottom: 18,
          boxShadow: '0 2px 12px rgba(26,58,54,0.06)',
        }}>
          <SectionHeader icon={<Sparkles size={16} />} title="Daily targets" noMargin />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginTop: 14 }}>
            <DayTypeControl
              icon={<Dumbbell size={18} />}
              label="Training days"
              accent="#1a3a36"
              cal={trainingCal} setCal={setTrainingCal}
              protein={trainingProtein} setProtein={setTrainingProtein}
              defaultCal={2541} defaultProtein={179}
            />
            <DayTypeControl
              icon={<Moon size={18} />}
              label="Rest days"
              accent="#7a9692"
              cal={restCal} setCal={setRestCal}
              protein={restProtein} setProtein={setRestProtein}
              defaultCal={2188} defaultProtein={172}
            />
          </div>

          {/* Days sliders */}
          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            <SliderRow
              icon={<Calendar size={14} />}
              label="Total days to plan"
              value={totalDays} setValue={setTotalDays}
              min={1} max={14} suffix=" days"
            />
            <SliderRow
              icon={<Dumbbell size={14} />}
              label="Training days"
              value={trainingDayCount} setValue={setTrainingDayCount}
              min={0} max={totalDays} suffix={` of ${totalDays}`}
            />
          </div>

          <div style={{
            marginTop: 14, padding: 12, background: C.cream, borderRadius: 12,
            display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
            fontSize: 12, color: C.tealSoft,
          }}>
            <span><b style={{ color: C.teal }}>{totalDays}-day period:</b> {trainingDayCount} training · {restDayCount} rest</span>
            <span><b style={{ color: C.teal }}>{weekCal.toLocaleString()}</b> cal total · <b style={{ color: C.teal }}>{weekProtein}g</b> protein · <b style={{ color: C.teal }}>{Math.round(weekCal / Math.max(1, totalDays))}</b> cal/day avg</span>
          </div>
        </div>

        {/* ---- MODE TABS + SHUFFLE ---- */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveMode('training')} style={tabBtn(activeMode === 'training')}>
            <Dumbbell size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
            Training day ({trainingDayCount}×)
          </button>
          <button onClick={() => setActiveMode('rest')} style={tabBtn(activeMode === 'rest')}>
            <Moon size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />
            Rest day ({restDayCount}×)
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={shuffleAll} className="btn" style={{
            background: '#fff', color: C.teal, border: '1px solid #cfd9d6',
            borderRadius: 999, padding: '8px 14px', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
          }}><Shuffle size={13} /> Shuffle all</button>
        </div>

        {/* ---- MEAL CARDS ---- */}
        {currentPlan && (
          <div style={{ background: '#fff', borderRadius: 22, padding: 20, marginBottom: 18, boxShadow: '0 2px 12px rgba(26,58,54,0.06)' }}>
            <SectionHeader
              icon={activeMode === 'training' ? <Dumbbell size={16} /> : <Moon size={16} />}
              title={`${activeMode === 'training' ? 'Training' : 'Rest'} day meals`}
              sub={`Each meal × ${currentDayCount} ${currentDayLabel} day${currentDayCount === 1 ? '' : 's'}`}
              noMargin
              right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 11 }}>
                  <span style={{ color: C.tealSoft }}>
                    Total: <b style={{ color: C.teal }}>{activeMode === 'training' ? tTotals.cal : rTotals.cal}</b> cal · <b style={{ color: C.teal }}>{activeMode === 'training' ? tTotals.p : rTotals.p}g</b> protein
                  </span>
                  <button onClick={shuffleCurrent} style={{
                    background: C.bgB, border: 'none', borderRadius: 999, padding: '5px 11px',
                    fontSize: 11, fontWeight: 600, color: C.teal, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
                  }}><Shuffle size={12} /> Shuffle these</button>
                </div>
              }
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14, marginTop: 14 }}>
              {currentSlots.map(slot => {
                const meal = currentPlan[slot];
                if (!meal) return null;
                const isSwapping = swapping === slot;
                const isRecipeOpen = recipeOpen[slot];
                const list = MEALS[slot];
                const recipeKey = `${activeMode}-${slot}`;

                return (
                  <div key={slot} className="meal-card fade-in" style={{
                    background: '#fff', borderRadius: 18, padding: 16,
                    boxShadow: '0 2px 10px rgba(26,58,54,0.06)',
                    border: isSwapping ? `2px solid ${C.accent}` : '2px solid transparent',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    {/* Header: slot + name + cal pill */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.mute }}>
                          {SLOT_META[slot].icon} {SLOT_META[slot].label}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, color: C.teal, lineHeight: 1.25 }}>{meal.name}</div>
                      </div>
                      <div style={{
                        background: C.bgB, color: C.teal, padding: '4px 10px', borderRadius: 999,
                        fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 8,
                      }}>{meal.macros.calories} cal</div>
                    </div>

                    {/* Macros */}
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: C.tealSoft, marginBottom: 10 }}>
                      <span style={{ fontWeight: 600 }}>P {meal.macros.protein}g</span>
                      <span>C {meal.macros.carbs}g</span>
                      <span>F {meal.macros.fats}g</span>
                    </div>

                    {/* Action buttons */}
                    {!isSwapping && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 'auto' }}>
                        <button
                          className="btn"
                          onClick={() => toggleRecipe(slot)}
                          style={{
                            background: isRecipeOpen ? C.teal : C.cream,
                            border: 'none', borderRadius: 10, padding: '8px 10px',
                            fontSize: 12, fontWeight: 600,
                            color: isRecipeOpen ? '#fff' : C.teal,
                            cursor: 'pointer', fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                          }}
                        ><BookOpen size={13} /> {isRecipeOpen ? 'Hide recipe' : 'View recipe'}</button>
                        <button
                          className="btn"
                          onClick={() => { setSwapping(slot); setSwapSearch(''); }}
                          style={{
                            background: C.bgB, border: 'none', borderRadius: 10, padding: '8px 10px',
                            fontSize: 12, fontWeight: 600, color: C.teal, cursor: 'pointer', fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                          }}
                        ><Shuffle size={13} /> Swap meal</button>
                      </div>
                    )}

                    {/* Recipe expand: two-column ingredients + method */}
                    {isRecipeOpen && !isSwapping && (
                      <RecipePanel meal={meal} dayCount={currentDayCount} dayLabel={currentDayLabel} C={C} />
                    )}

                    {/* Swap UI */}
                    {isSwapping && (
                      <SwapPanel
                        list={list}
                        currentId={meal.id}
                        search={swapSearch}
                        setSearch={setSwapSearch}
                        onPick={(id) => swapMeal(slot, id)}
                        onCancel={() => { setSwapping(null); setSwapSearch(''); }}
                        C={C}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- SHOPPING LIST ---- */}
        <div style={{ background: '#fff', borderRadius: 22, padding: 20, marginBottom: 18, boxShadow: '0 2px 12px rgba(26,58,54,0.06)' }}>
          <SectionHeader
            icon={<ShoppingBasket size={16} />}
            title="Shopping list"
            sub={`For ${totalDays} day${totalDays > 1 ? 's' : ''} (${trainingDayCount} training + ${restDayCount} rest). Pantry items excluded.`}
            noMargin
            right={
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setView('combined')} style={tabBtn(view === 'combined', true)}>Combined</button>
                <button onClick={() => setView('perMeal')} style={tabBtn(view === 'perMeal', true)}>Per meal</button>
                <button onClick={exportList} className="btn" style={{
                  background: C.teal, color: '#fff', border: 'none', borderRadius: 999, padding: '6px 11px',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit',
                }}><Download size={12} /> Export</button>
              </div>
            }
          />

          <div style={{ marginTop: 14 }}>
            {view === 'combined' ? (
              shoppingCombined.length === 0 ? (
                <div style={{ color: C.mute, textAlign: 'center', padding: 20, fontSize: 13 }}>
                  Add at least one day to see the shopping list.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 4 }}>
                  {shoppingCombined.map((i, idx) => (
                    <CheckItem key={idx} label={i.name} qty={fmtQty(i.qty, i.unit)} C={C} />
                  ))}
                </div>
              )
            ) : (
              <div>
                {shoppingPerMeal.length === 0 ? (
                  <div style={{ color: C.mute, textAlign: 'center', padding: 20, fontSize: 13 }}>
                    Add at least one day to see the per-meal breakdown.
                  </div>
                ) : (
                  shoppingPerMeal.map((m, idx) => {
                    const key = `${m.dayLabel}-${m.slot}-${idx}`;
                    const open = expanded[key];
                    return (
                      <div key={key} style={{
                        border: `1px solid ${C.line}`, borderRadius: 12, marginBottom: 8, overflow: 'hidden',
                      }}>
                        <button onClick={() => toggle(key)} style={{
                          width: '100%', background: open ? C.cream : '#fff', border: 'none',
                          padding: '10px 14px', display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                            <span style={{ color: m.dayLabel === 'Training' ? C.teal : C.tealSoft, fontWeight: 600 }}>{m.dayLabel}</span>
                            <span style={{ color: C.tealSoft, fontSize: 11 }}>×{m.dayCount}</span>
                            <span>·</span>
                            <span style={{ color: C.tealSoft, fontSize: 11 }}>{SLOT_META[m.slot].label}</span>
                            <span>·</span>
                            <span style={{ fontWeight: 600 }}>{m.mealName}</span>
                          </span>
                          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {open && (
                          <div style={{ padding: '6px 14px 12px', borderTop: `1px solid ${C.line}` }}>
                            {m.ingredients.map((i, j) => (
                              <CheckItem key={j} label={i.name} qty={fmtQty(i.qty, i.unit)} C={C} small />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* ---- FOOTER ---- */}
        <div style={{ textAlign: 'center', fontSize: 11, color: C.mute, padding: '8px 0 24px' }}>
          Fit with Jade · {mealsMaster.total_meals} meals loaded
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function RecipePanel({ meal, dayCount, dayLabel, C }) {
  const hasMethod = meal.method && meal.method.length > 0;
  // Split ingredients: "shop-able with qty" vs "to taste / pantry"
  const main = meal.ingredients.filter(i => i.unit !== 'to_taste' && i.qty !== undefined);
  const toTaste = meal.ingredients.filter(i => i.unit === 'to_taste' || i.qty === undefined);

  return (
    <div className="fade-in" style={{
      marginTop: 12, borderTop: `1px solid ${C.line}`, paddingTop: 12,
    }}>
      {/* Ingredients with two-column quantity layout */}
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.mute, marginBottom: 8 }}>
        Ingredients
      </div>

      {/* Column header row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto auto',
        columnGap: 10, alignItems: 'center',
        fontSize: 10, color: C.mute, fontWeight: 600, letterSpacing: '0.04em',
        padding: '0 0 4px', borderBottom: `1px dashed ${C.line}`, marginBottom: 6,
      }}>
        <span>Item</span>
        <span style={{ minWidth: 50, textAlign: 'right' }}>1 serve</span>
        <span style={{ minWidth: 64, textAlign: 'right', color: C.teal }}>× {dayCount} {dayLabel === 'training' ? 'tr.' : 'rest'}</span>
      </div>

      {main.map((ing, idx) => {
        const perServe = fmtQty(ing.qty, ing.unit);
        const totalQty = (ing.qty || 0) * dayCount;
        const total = fmtQty(totalQty, ing.unit);
        return (
          <div key={idx} style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto',
            columnGap: 10, alignItems: 'baseline',
            fontSize: 12.5, color: C.teal, padding: '4px 0',
            borderBottom: `1px dotted ${C.line}`,
          }}>
            <span>
              {ing.name}
              {ing.note && <span style={{ color: C.mute, fontSize: 10.5, marginLeft: 5 }}>({ing.note})</span>}
            </span>
            <span style={{ minWidth: 50, textAlign: 'right', color: C.tealSoft, fontVariantNumeric: 'tabular-nums' }}>{perServe}</span>
            <span style={{ minWidth: 64, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{total}</span>
          </div>
        );
      })}

      {toTaste.length > 0 && (
        <div style={{ fontSize: 11, color: C.mute, marginTop: 8, fontStyle: 'italic' }}>
          To taste: {toTaste.map(t => t.name).join(', ')}
        </div>
      )}

      {/* Method */}
      {hasMethod && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.mute, margin: '14px 0 6px' }}>
            Method
          </div>
          <ol style={{ paddingLeft: 18, margin: 0, fontSize: 12.5, color: C.teal, lineHeight: 1.5 }}>
            {meal.method.map((step, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>{step}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

function SwapPanel({ list, currentId, search, setSearch, onPick, onCancel, C }) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(m => m.name.toLowerCase().includes(q));
  }, [list, search]);

  return (
    <div className="fade-in" style={{
      marginTop: 10, borderTop: `1px solid ${C.line}`, paddingTop: 10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
        background: C.cream, padding: '6px 10px', borderRadius: 8,
      }}>
        <Search size={13} color={C.mute} />
        <input
          autoFocus
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${list.length} meals…`}
          style={{
            flex: 1, border: 'none', background: 'transparent', outline: 'none',
            fontSize: 13, color: C.teal, fontFamily: 'inherit',
          }}
        />
        <button onClick={onCancel} style={{
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 2,
          color: C.mute,
        }} aria-label="Cancel"><X size={14} /></button>
      </div>

      <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 4 }}>
        {filtered.length === 0 && (
          <div style={{ fontSize: 12, color: C.mute, padding: 10, textAlign: 'center' }}>No meals match “{search}”.</div>
        )}
        {filtered.map(m => {
          const isCurrent = m.id === currentId;
          return (
            <button
              key={m.id}
              onClick={() => onPick(m.id)}
              className="swap-btn"
              style={{
                width: '100%', textAlign: 'left', background: isCurrent ? C.bgB : 'transparent',
                border: 'none', padding: '8px 10px', borderRadius: 8,
                cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: 8, fontFamily: 'inherit',
                marginBottom: 2,
              }}
            >
              <span style={{ fontSize: 12.5, color: C.teal, fontWeight: isCurrent ? 600 : 500 }}>
                {isCurrent && <Check size={11} style={{ marginRight: 4, verticalAlign: '-1px' }} />}
                {m.name}
              </span>
              <span style={{ fontSize: 11, color: C.tealSoft, whiteSpace: 'nowrap' }}>
                {m.macros.calories} cal · P{m.macros.protein}g
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function tabBtn(active, small) {
  return {
    background: active ? '#1a3a36' : '#fff',
    color: active ? '#fff' : '#1a3a36',
    border: active ? 'none' : '1px solid #cfd9d6',
    borderRadius: 999,
    padding: small ? '5px 11px' : '8px 14px',
    fontSize: small ? 11 : 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };
}

function DayTypeControl({ icon, label, accent, cal, setCal, protein, setProtein, defaultCal, defaultProtein }) {
  const C = { teal: '#1a3a36', tealSoft: '#4a6864', mute: '#7a9692', cream: '#fbf6f1' };
  return (
    <div style={{ background: C.cream, borderRadius: 14, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: accent, fontWeight: 600, fontSize: 13 }}>
          {icon} {label}
        </div>
        <button
          onClick={() => { setCal(defaultCal); setProtein(defaultProtein); }}
          style={{
            background: 'transparent', border: 'none', color: C.mute, fontSize: 10,
            cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline',
          }}
        >reset</button>
      </div>
      <SliderRow icon={<Flame size={12} />} label="Calories" value={cal} setValue={setCal} min={1500} max={3500} step={1} suffix=" cal" />
      <div style={{ height: 8 }} />
      <SliderRow icon={<Beef size={12} />} label="Protein"   value={protein} setValue={setProtein} min={80} max={250} step={1} suffix="g" />
    </div>
  );
}

function SliderRow({ icon, label, value, setValue, min, max, step = 1, suffix = '' }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#4a6864', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
          {icon} {label}
        </span>
        <span style={{ fontSize: 12, color: '#1a3a36', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
      />
    </div>
  );
}

function SectionHeader({ icon, title, sub, noMargin, right }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'start',
      gap: 12, flexWrap: 'wrap', marginBottom: noMargin ? 0 : 14,
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#1a3a36', fontSize: 15 }}>
          {icon} {title}
        </div>
        {sub && <div style={{ fontSize: 11, color: '#7a9692', marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function CheckItem({ label, qty, C, small }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => setDone(d => !d)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'transparent', border: 'none', padding: small ? '4px 0' : '5px 4px',
        cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%',
      }}
    >
      <span style={{
        width: 16, height: 16, borderRadius: 4,
        border: `1.5px solid ${done ? C.teal : '#c9d2cf'}`,
        background: done ? C.teal : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {done && <Check size={11} color="#fff" strokeWidth={3} />}
      </span>
      <span style={{
        fontSize: small ? 12 : 12.5, color: done ? C.mute : C.teal,
        textDecoration: done ? 'line-through' : 'none',
        flex: 1,
      }}>{label}</span>
      <span style={{
        fontSize: small ? 11 : 11.5, color: C.tealSoft, fontVariantNumeric: 'tabular-nums',
        textDecoration: done ? 'line-through' : 'none',
      }}>{qty}</span>
    </button>
  );
}
