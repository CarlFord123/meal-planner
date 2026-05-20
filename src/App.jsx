import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Sparkles, ShoppingBasket, Shuffle, ChevronDown, ChevronUp,
  Check, X, Download, Flame, Beef, Wheat, Droplet, Dumbbell,
  Moon, Calendar, Plus, Pencil, Trash2, ChevronRight, BookOpen,
} from 'lucide-react';
import { MEALS, SECTION_META } from './data/meals';

// ─── constants ────────────────────────────────────────────────────
const SLOTS      = ['preworkout','breakfast','lunch','dinner','snack','funSnack'];
const REST_SLOTS = SLOTS.filter(s => s !== 'preworkout');
const HAS_INSTRUCTIONS = ['lunch','dinner'];
const COLORS = {
  bg:      'linear-gradient(135deg,#c7e9e2 0%,#f5e8e0 100%)',
  dark:    '#1a3a36',
  mid:     '#4a6864',
  muted:   '#7a9692',
  peach:   '#f5e8e0',
  pink:    '#f4b8b8',
  green:   '#a8d5ba',
  purple:  '#c7a4d9',
  yellow:  '#f0c987',
  white:   '#fff',
  border:  '#eef3f1',
  track:   '#d4e9e3',
};

// ─── shopping categories ──────────────────────────────────────────
const CATEGORY_ORDER = [
  'Meat & Protein','Dairy','Fruit & Veg',
  'Grains & Bakery','Protein Supplements',
  'Canned & Packaged','Condiments & Sauces','Oils & Fats','Other',
];
function getCategory(item) {
  const il = item.toLowerCase();
  if (/chicken|beef|mince|steak|salmon|prawn|tuna|egg|bacon|ham|pork|turkey|deli|leg ham/.test(il)) return 'Meat & Protein';
  if (/cheese|yoghurt|chobani|yopro|cooking cream|ricotta|cottage|feta|mozzarella|parmesan|milk|cream cheese|sour cream/.test(il)) return 'Dairy';
  if (/protein|macro mike|collagen|whey|faba bean|noway/.test(il)) return 'Protein Supplements';
  if (/banana|apple|mango|berry|strawberr|raspberr|blueberr|pineapple|avocado|tomato|onion|capsicum|zucchini|broccoli|carrot|spinach|cucumber|lettuce|corn|peas|beetroot|pumpkin|potato|spud|sweet potato|celery|asparagus|mushroom|eggplant|cauliflower|rocket|cabbage|edamame|dates?|pear|peach|coconut|lime|lemon|mango|coriander|mint|ginger|spring onion/.test(il)) return 'Fruit & Veg';
  if (/oil|spray|butter|nutelex|olive/.test(il)) return 'Oils & Fats';
  if (/oat|rice|pasta|noodle|bread|wrap|muffin|bagel|flour|biscuit|crumpet|cracker|risoni|couscous|macaroni|spaghetti|linguine|pappardelle|vermicelli|cous/.test(il)) return 'Grains & Bakery';
  if (/sauce|mayo|soy|sriracha|ketchup|bbq|salsa|pesto|chilli|honey|syrup|jam|teriyaki|curry paste|fish sauce|worcestershire|mustard|vinegar|passata|harissa|tzaziki|hommus|hummus/.test(il)) return 'Condiments & Sauces';
  if (/stock|diced tomato|tomato paste|coconut cream|beans|chickpea|kidney|black bean|cannellini|lentil|wine|seaweed/.test(il)) return 'Canned & Packaged';
  return 'Other';
}

// ─── helpers ──────────────────────────────────────────────────────
const round = (n, dp=0) => { const m=10**dp; return Math.round(n*m)/m; };
const fmtQty = (qty, unit) => {
  const q = qty < 10 ? round(qty,1) : round(qty);
  return unit ? `${q}${unit==='g'||unit==='ml' ? unit : ' '+unit}` : `${q}`;
};

function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t>>>15), t|1);
    t ^= t + Math.imul(t^(t>>>7), t|61);
    return ((t^(t>>>14))>>>0) / 4294967296;
  };
}

function getAllMeals(slot, customMeals=[]) {
  return [...(MEALS[slot]||[]), ...(customMeals[slot]||[])];
}

function buildPlan(targetCal, targetProtein, includePreworkout, seed, customMeals={}) {
  const rng  = mulberry32(seed);
  const pick = arr => arr[Math.floor(rng()*arr.length)];
  const calTol=75, proteinTol=8;
  let best=null;
  for (let a=0; a<800; a++) {
    const pre = includePreworkout ? pick(getAllMeals('preworkout',customMeals)) : null;
    const b   = pick(getAllMeals('breakfast',customMeals));
    const l   = pick(getAllMeals('lunch',customMeals));
    const d   = pick(getAllMeals('dinner',customMeals));
    const s   = pick(getAllMeals('snack',customMeals));
    const f   = pick(getAllMeals('funSnack',customMeals));
    const meals=[pre,b,l,d,s,f].filter(Boolean);
    const tCal=meals.reduce((s,m)=>s+m.cal,0);
    const tP  =meals.reduce((s,m)=>s+m.p,  0);
    const score=((tCal-targetCal)/calTol)**2 + ((tP-targetProtein)/proteinTol)**2;
    if (!best||score<best.score) {
      best={preworkout:pre,breakfast:b,lunch:l,dinner:d,snack:s,funSnack:f,totalCal:tCal,totalP:tP,score};
      if (score<0.5) break;
    }
  }
  return best;
}

function applyOverrides(plan, overrides, customMeals={}) {
  if (!plan) return plan;
  const out={...plan};
  Object.entries(overrides).forEach(([slot,name])=>{
    const found=[...getAllMeals(slot,customMeals)].find(m=>m.name===name);
    if (found) out[slot]=found;
  });
  return out;
}

// Apply per-ingredient qty overrides → recompute meal macros
function applyIngOverrides(meal, slotOverrides={}) {
  if (!meal) return meal;
  if (!Object.keys(slotOverrides).length) return meal;
  const ings = meal.ing.map((ing, idx) => {
    const newQty = slotOverrides[idx];
    if (newQty===undefined || newQty===ing.qty) return ing;
    const scale = newQty / (ing.qty||1);
    return { ...ing, qty:newQty, cal:Math.round(ing.cal*scale),
             c:Math.round(ing.c*scale), f:Math.round(ing.f*scale), p:Math.round(ing.p*scale) };
  });
  return { ...meal, ing:ings,
    cal:ings.reduce((s,i)=>s+i.cal,0), c:ings.reduce((s,i)=>s+i.c,0),
    f:ings.reduce((s,i)=>s+i.f,0),    p:ings.reduce((s,i)=>s+i.p,0) };
}

function planTotals(plan, ingOvr={}) {
  if (!plan) return {cal:0,c:0,f:0,p:0};
  return SLOTS.reduce((acc,slot)=>{
    const m = applyIngOverrides(plan[slot], ingOvr[slot]);
    if (!m) return acc;
    return {cal:acc.cal+m.cal, c:acc.c+m.c, f:acc.f+m.f, p:acc.p+m.p};
  },{cal:0,c:0,f:0,p:0});
}

// Build shopping list respecting per-day toggles
function buildShoppingList(trainingPlan, restPlan, trainingIngOvr, restIngOvr, dayToggles, trainingDayCount, totalDays, customMeals={}) {
  const combined={};
  const perMeal=[];

  for (let d=0; d<totalDays; d++) {
    const isTraining = d < trainingDayCount;
    const plan   = isTraining ? trainingPlan : restPlan;
    const ingOvr = isTraining ? trainingIngOvr : restIngOvr;
    const toggles = dayToggles[d] || {};
    const label   = isTraining ? 'Training' : 'Rest';
    if (!plan) continue;

    SLOTS.forEach(slot => {
      if (isTraining===false && slot==='preworkout') return;
      if (!toggles[slot]) return; // day slot is toggled off
      const meal = applyIngOverrides(plan[slot], ingOvr[slot]);
      if (!meal) return;
      meal.ing.forEach(i => {
        const key=`${i.item}|${i.unit}`;
        if (!combined[key]) combined[key]={item:i.item,qty:0,unit:i.unit};
        combined[key].qty += i.qty;
      });
      perMeal.push({mealName:meal.name,slot,dayLabel:label,dayNum:d+1,ingredients:meal.ing.map(i=>({...i}))});
    });
  }

  const byCategory={};
  Object.values(combined).sort((a,b)=>a.item.localeCompare(b.item)).forEach(i=>{
    const cat=getCategory(i.item);
    if (!byCategory[cat]) byCategory[cat]=[];
    byCategory[cat].push(i);
  });

  return { combined:Object.values(combined).sort((a,b)=>a.item.localeCompare(b.item)), byCategory, perMeal };
}

// ─── localStorage ────────────────────────────────────────────────
const LS_KEY='fwj-planner-v2';
const DEFAULT_STATE={
  trainingCal:2541, trainingProtein:179,
  restCal:2188,     restProtein:172,
  totalDays:7,      trainingDayCount:5,
  trainingSeed:1,   restSeed:2,
  trainingOverrides:{}, restOverrides:{},
  trainingIngOvr:{},    restIngOvr:{},
  customMeals:{preworkout:[],breakfast:[],lunch:[],dinner:[],snack:[],funSnack:[]},
};
function loadState() {
  try { const s=localStorage.getItem(LS_KEY); return s ? {...DEFAULT_STATE,...JSON.parse(s)} : DEFAULT_STATE; }
  catch { return DEFAULT_STATE; }
}
function makeDefaultToggles(totalDays, trainingDayCount) {
  return Array.from({length:totalDays},(_,i)=>{
    const isTrain=i<trainingDayCount;
    return {preworkout:isTrain,breakfast:true,lunch:true,dinner:true,snack:true,funSnack:true};
  });
}

// ─── MAIN APP ────────────────────────────────────────────────────
export default function App() {
  const [st, setSt] = useState(loadState);
  const { trainingCal,trainingProtein,restCal,restProtein,
          totalDays,trainingDayCount,trainingSeed,restSeed,
          trainingOverrides,restOverrides,
          trainingIngOvr,restIngOvr,
          customMeals } = st;

  // Day toggles stored separately (reset when day counts change)
  const [dayToggles, setDayToggles] = useState(()=>makeDefaultToggles(st.totalDays,st.trainingDayCount));

  const set = (patch) => setSt(s=>({...s,...patch}));

  // Persist to localStorage
  useEffect(()=>{ try{localStorage.setItem(LS_KEY,JSON.stringify(st));}catch{} },[st]);

  // UI state (not persisted)
  const [activeMode, setActiveMode] = useState('training');
  const [expandedCard, setExpandedCard] = useState(null); // 'slot' key
  const [swapping, setSwapping]         = useState(null);
  const [editingSlot, setEditingSlot]   = useState(null); // slot being ingredient-edited
  const [shopView, setShopView]         = useState('category');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customFormSlot, setCustomFormSlot] = useState('lunch');

  const restDayCount = Math.max(0, totalDays-trainingDayCount);

  // Plans
  const baseTraining = useMemo(()=>buildPlan(trainingCal,trainingProtein,true,trainingSeed,customMeals),[trainingCal,trainingProtein,trainingSeed,customMeals]);
  const baseRest     = useMemo(()=>buildPlan(restCal,restProtein,false,restSeed,customMeals),[restCal,restProtein,restSeed,customMeals]);
  const trainingPlan = useMemo(()=>applyOverrides(baseTraining,trainingOverrides,customMeals),[baseTraining,trainingOverrides,customMeals]);
  const restPlan     = useMemo(()=>applyOverrides(baseRest,restOverrides,customMeals),[baseRest,restOverrides,customMeals]);

  const tTotals = useMemo(()=>planTotals(trainingPlan,trainingIngOvr),[trainingPlan,trainingIngOvr]);
  const rTotals = useMemo(()=>planTotals(restPlan,restIngOvr),[restPlan,restIngOvr]);

  const weekCal     = tTotals.cal*trainingDayCount + rTotals.cal*restDayCount;
  const weekProtein = tTotals.p*trainingDayCount   + rTotals.p*restDayCount;

  const { combined:shopCombined, byCategory:shopByCategory, perMeal:shopPerMeal } = useMemo(
    ()=>buildShoppingList(trainingPlan,restPlan,trainingIngOvr,restIngOvr,dayToggles,trainingDayCount,totalDays,customMeals),
    [trainingPlan,restPlan,trainingIngOvr,restIngOvr,dayToggles,trainingDayCount,totalDays,customMeals]
  );

  // Helper: update day count + regenerate toggles
  const setTotalDays = (n) => {
    const newTrain=Math.min(trainingDayCount,n);
    set({totalDays:n,trainingDayCount:newTrain});
    setDayToggles(makeDefaultToggles(n,newTrain));
  };
  const setTrainingDayCount = (n) => {
    set({trainingDayCount:n});
    setDayToggles(makeDefaultToggles(totalDays,n));
  };

  const currentPlan  = activeMode==='training' ? trainingPlan : restPlan;
  const currentSlots = activeMode==='training' ? SLOTS : REST_SLOTS;
  const currentTotals= activeMode==='training' ? tTotals : rTotals;
  const currentCal   = activeMode==='training' ? trainingCal : restCal;
  const currentProt  = activeMode==='training' ? trainingProtein : restProtein;
  const currentIngOvr= activeMode==='training' ? trainingIngOvr : restIngOvr;

  const swapMeal = (slot,mealName) => {
    if (activeMode==='training') set({trainingOverrides:{...trainingOverrides,[slot]:mealName}});
    else set({restOverrides:{...restOverrides,[slot]:mealName}});
    setSwapping(null);
  };

  const shuffleCurrent = () => {
    if (activeMode==='training') set({trainingOverrides:{},trainingSeed:trainingSeed+1});
    else set({restOverrides:{},restSeed:restSeed+1});
  };
  const shuffleAll = () => set({trainingOverrides:{},restOverrides:{},trainingSeed:trainingSeed+1,restSeed:restSeed+1});

  const updateIngQty = (slot,ingIdx,newQty) => {
    const key = activeMode==='training' ? 'trainingIngOvr' : 'restIngOvr';
    const prev = activeMode==='training' ? trainingIngOvr : restIngOvr;
    set({[key]:{...prev,[slot]:{...(prev[slot]||{}),[ingIdx]:Number(newQty)}}});
  };
  const resetIngOvr = (slot) => {
    const key = activeMode==='training' ? 'trainingIngOvr' : 'restIngOvr';
    const prev = activeMode==='training' ? trainingIngOvr : restIngOvr;
    const next={...prev}; delete next[slot];
    set({[key]:next});
  };

  const addCustomMeal = (meal) => {
    set({customMeals:{...customMeals,[meal.slot]:[...(customMeals[meal.slot]||[]),{...meal}]}});
    setShowCustomForm(false);
  };
  const deleteCustomMeal = (slot,idx) => {
    const list=[...(customMeals[slot]||[])]; list.splice(idx,1);
    set({customMeals:{...customMeals,[slot]:list}});
  };

  const exportList = () => {
    const lines=[`MEAL PLAN & SHOPPING LIST — ${totalDays} days`,''];
    if (trainingDayCount>0&&trainingPlan) {
      lines.push(`TRAINING DAYS (×${trainingDayCount}) — target ${trainingCal} cal / ${trainingProtein}g protein`);
      SLOTS.forEach(s=>{ if(trainingPlan[s]) lines.push(`  ${SECTION_META[s].label}: ${trainingPlan[s].name} (${trainingPlan[s].cal} cal, ${trainingPlan[s].p}g protein)`); });
      lines.push('');
    }
    if (restDayCount>0&&restPlan) {
      lines.push(`REST DAYS (×${restDayCount}) — target ${restCal} cal / ${restProtein}g protein`);
      REST_SLOTS.forEach(s=>{ if(restPlan[s]) lines.push(`  ${SECTION_META[s].label}: ${restPlan[s].name} (${restPlan[s].cal} cal, ${restPlan[s].p}g protein)`); });
      lines.push('');
    }
    lines.push('SHOPPING LIST:');
    CATEGORY_ORDER.forEach(cat=>{ if(shopByCategory[cat]) { lines.push(`\n${cat}:`); shopByCategory[cat].forEach(i=>lines.push(`  ☐ ${i.item} — ${fmtQty(i.qty,i.unit)}`)); }});
    const blob=new Blob([lines.join('\n')],{type:'text/plain'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a');
    a.href=url; a.download=`meal-plan-${totalDays}days.txt`; a.click(); URL.revokeObjectURL(url);
  };

  // ─ render ──────────────────────────────────────────────────────
  return (
    <div style={{fontFamily:"'Outfit','Inter',-apple-system,sans-serif",background:COLORS.bg,minHeight:'100vh',padding:'32px 16px',color:COLORS.dark}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Pacifico&display=swap');
        *{box-sizing:border-box;}
        input[type=range]{-webkit-appearance:none;width:100%;height:6px;background:${COLORS.track};border-radius:3px;outline:none;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;background:${COLORS.pink};border:3px solid #fff;border-radius:50%;cursor:pointer;box-shadow:0 2px 6px rgba(26,58,54,.2);}
        input[type=range]::-moz-range-thumb{width:22px;height:22px;background:${COLORS.pink};border:3px solid #fff;border-radius:50%;cursor:pointer;}
        .card{transition:transform .2s,box-shadow .2s;}
        .card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(26,58,54,.12);}
        .btn{transition:all .15s;cursor:pointer;}
        .btn:hover{transform:translateY(-1px);}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn .3s ease-out;}
        input[type=number]::-webkit-inner-spin-button{opacity:1;}
        .toggle{position:relative;display:inline-block;width:40px;height:22px;}
        .toggle input{opacity:0;width:0;height:0;}
        .toggle-slider{position:absolute;cursor:pointer;inset:0;background:#cfdedb;border-radius:11px;transition:.2s;}
        .toggle-slider:before{content:'';position:absolute;width:16px;height:16px;left:3px;top:3px;background:white;border-radius:50%;transition:.2s;}
        input:checked+.toggle-slider{background:${COLORS.dark};}
        input:checked+.toggle-slider:before{transform:translateX(18px);}
      `}</style>

      <div style={{maxWidth:1100,margin:'0 auto'}}>

        {/* Header */}
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontFamily:"'Pacifico',cursive",fontSize:18,color:COLORS.dark,marginBottom:4,opacity:.7}}>Fit with Jade</div>
          <h1 style={{fontSize:'clamp(28px,5vw,44px)',margin:0,fontWeight:700,letterSpacing:'-.02em'}}>Weekly Meal Planner</h1>
          <p style={{color:COLORS.mid,margin:'8px 0 0',fontSize:15}}>Calories + protein · custom days · one shopping list</p>
        </div>

        {/* ── PREP PERIOD ───────────────────────────────────────── */}
        <div style={{background:COLORS.dark,color:'#fff',borderRadius:20,padding:'22px 26px',marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
            <Calendar size={18}/><h2 style={{margin:0,fontSize:17,fontWeight:600}}>Prep period</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24}}>
            <SliderField label="Total days" value={totalDays} min={1} max={14} step={1}
              onChange={setTotalDays}
              marks={['1','7','14']} />
            <SliderField label="Of those — training days"
              value={Math.min(trainingDayCount,totalDays)} min={0} max={totalDays} step={1}
              onChange={setTrainingDayCount}
              sub={<span style={{fontSize:11,opacity:.7}}>🛌 {restDayCount} rest · 💪 {Math.min(trainingDayCount,totalDays)} training</span>} />
          </div>
          <div style={{display:'flex',gap:20,marginTop:18,paddingTop:16,borderTop:'1px solid rgba(255,255,255,.15)',flexWrap:'wrap'}}>
            {[['Period calories',weekCal.toLocaleString()],
              ['Period protein',`${weekProtein}g`],
              ['Avg / day',`${totalDays>0?Math.round(weekCal/totalDays):0} cal · ${totalDays>0?Math.round(weekProtein/totalDays):0}g`]
            ].map(([lbl,val])=>(
              <div key={lbl} style={{flex:'1 1 100px'}}>
                <div style={{fontSize:10,opacity:.6,textTransform:'uppercase',letterSpacing:'.08em'}}>{lbl}</div>
                <div style={{fontSize:20,fontWeight:700}}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CALORIE / PROTEIN TARGETS ─────────────────────────── */}
        <div style={{background:COLORS.white,borderRadius:24,padding:'24px 28px',marginBottom:20,boxShadow:'0 4px 20px rgba(26,58,54,.08)'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24,marginBottom:16}}>
            <DayTypeControl icon={<Dumbbell size={16}/>} label="Training days" accent={COLORS.pink}
              cal={trainingCal} setCal={v=>{set({trainingCal:v,trainingOverrides:{}});}}
              protein={trainingProtein} setProtein={v=>{set({trainingProtein:v,trainingOverrides:{}}); }}
              defaultCal={2541} defaultProtein={179} />
            <DayTypeControl icon={<Moon size={16}/>} label="Rest days" accent={COLORS.green}
              cal={restCal} setCal={v=>{set({restCal:v,restOverrides:{}});}}
              protein={restProtein} setProtein={v=>{set({restProtein:v,restOverrides:{}}); }}
              defaultCal={2188} defaultProtein={172} />
          </div>
          <Btn dark onClick={shuffleAll}><Shuffle size={16}/> Shuffle all meals</Btn>
        </div>

        {/* ── DAY SCHEDULE (per-day toggles) ────────────────────── */}
        {totalDays>0 && (
          <div style={{background:COLORS.white,borderRadius:24,padding:'24px 28px',marginBottom:20,boxShadow:'0 4px 20px rgba(26,58,54,.08)'}}>
            <SectionHeader icon={<Calendar size={18}/>} title="Day schedule"
              sub="Toggle off any meal you won't eat that day — shopping list updates automatically" />
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:10}}>
              {Array.from({length:totalDays},(_,d)=>{
                const isTrain=d<trainingDayCount;
                const tog=dayToggles[d]||{};
                const slots=isTrain?SLOTS:REST_SLOTS;
                const active=slots.filter(s=>tog[s]!==false).length;
                return (
                  <div key={d} style={{border:`1px solid ${COLORS.border}`,borderRadius:14,overflow:'hidden'}}>
                    <div style={{background:isTrain?COLORS.dark:'#f0f8f4',color:isTrain?'#fff':COLORS.dark,padding:'10px 14px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontWeight:600,fontSize:13}}>Day {d+1} — {isTrain?'Training':'Rest'}</span>
                      <span style={{fontSize:11,opacity:.7}}>{active}/{slots.length} meals</span>
                    </div>
                    <div style={{padding:'10px 14px',display:'flex',flexDirection:'column',gap:6}}>
                      {slots.map(slot=>(
                        <label key={slot} style={{display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',userSelect:'none'}}>
                          <span style={{fontSize:13,color:COLORS.dark}}>
                            {SECTION_META[slot].icon} {SECTION_META[slot].label}
                          </span>
                          <label className="toggle">
                            <input type="checkbox" checked={tog[slot]!==false}
                              onChange={e=>{
                                const next=[...dayToggles];
                                next[d]={...tog,[slot]:e.target.checked};
                                setDayToggles(next);
                              }} />
                            <span className="toggle-slider"/>
                          </label>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── MODE TABS ─────────────────────────────────────────── */}
        {(trainingDayCount>0||restDayCount>0) && (
          <div style={{display:'flex',gap:8,marginBottom:16,background:COLORS.white,padding:6,borderRadius:14,boxShadow:'0 2px 10px rgba(26,58,54,.06)'}}>
            {trainingDayCount>0&&<ModeTab active={activeMode==='training'} onClick={()=>{setActiveMode('training');setSwapping(null);setExpandedCard(null);}}><Dumbbell size={14}/> Training meals ×{trainingDayCount}</ModeTab>}
            {restDayCount>0&&<ModeTab active={activeMode==='rest'} onClick={()=>{setActiveMode('rest');setSwapping(null);setExpandedCard(null);}}><Moon size={14}/> Rest meals ×{restDayCount}</ModeTab>}
          </div>
        )}

        {/* Auto-switch inactive mode */}
        {activeMode==='training'&&trainingDayCount===0&&restDayCount>0&&setActiveMode('rest')}
        {activeMode==='rest'&&restDayCount===0&&trainingDayCount>0&&setActiveMode('training')}

        {/* ── MACRO SUMMARY ─────────────────────────────────────── */}
        {currentPlan&&(activeMode==='training'?trainingDayCount>0:restDayCount>0) && (
          <div style={{background:COLORS.white,borderRadius:20,padding:'18px 24px',marginBottom:16,boxShadow:'0 4px 20px rgba(26,58,54,.08)',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:16,alignItems:'center'}}>
            <MacroStat icon={<Flame size={16}/>} label="Calories" value={currentTotals.cal} target={currentCal} accent={COLORS.pink} max={currentCal*1.1}/>
            <MacroStat icon={<Beef size={16}/>}  label="Protein"  value={`${currentTotals.p}g`} target={`${currentProt}g`} accent={COLORS.purple} bar={currentTotals.p/currentProt}/>
            <MacroStat icon={<Wheat size={16}/>} label="Carbs"    value={`${currentTotals.c}g`} accent={COLORS.yellow}/>
            <MacroStat icon={<Droplet size={16}/>} label="Fats"   value={`${currentTotals.f}g`} accent={COLORS.green}/>
          </div>
        )}

        {/* ── MEAL CARDS ────────────────────────────────────────── */}
        {currentPlan&&(activeMode==='training'?trainingDayCount>0:restDayCount>0) && (
          <div style={{marginBottom:24}}>
            <SectionHeader icon={<Sparkles size={18}/>}
              title={`${activeMode==='training'?'Training':'Rest'} day meals`}
              sub={`Tap a meal for ingredients & recipe · used for ${activeMode==='training'?trainingDayCount:restDayCount} day${(activeMode==='training'?trainingDayCount:restDayCount)>1?'s':''}`}
              right={<Btn small onClick={shuffleCurrent}><Shuffle size={12}/> Shuffle these</Btn>} />

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
              {currentSlots.map(slot=>{
                const rawMeal=currentPlan[slot];
                if (!rawMeal) return null;
                const meal=applyIngOverrides(rawMeal,currentIngOvr[slot]||{});
                const isSwapping=swapping===slot;
                const isExpanded=expandedCard===slot;
                const isEditing=editingSlot===slot;
                const list=getAllMeals(slot,customMeals);
                const hasInstr=HAS_INSTRUCTIONS.includes(slot)&&meal.instructions;

                return (
                  <div key={slot} className="card fade-in" style={{background:COLORS.white,borderRadius:18,padding:18,boxShadow:'0 2px 10px rgba(26,58,54,.06)',border:`2px solid ${isSwapping?COLORS.pink:isExpanded?COLORS.track:'transparent'}`}}>
                    {/* Slot label + name + cal badge */}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:10}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em',color:COLORS.muted}}>
                          {SECTION_META[slot].icon} {SECTION_META[slot].label}
                        </div>
                        <div style={{fontSize:16,fontWeight:600,marginTop:4,lineHeight:1.25}}>{meal.name}</div>
                      </div>
                      <div style={{background:COLORS.peach,padding:'4px 10px',borderRadius:999,fontSize:11,fontWeight:700,whiteSpace:'nowrap',marginLeft:8}}>{meal.cal} cal</div>
                    </div>

                    {/* Macro pills */}
                    <div style={{display:'flex',gap:10,fontSize:11,color:COLORS.mid,marginBottom:10}}>
                      <span style={{fontWeight:600}}>P {meal.p}g</span>
                      <span>C {meal.c}g</span>
                      <span>F {meal.f}g</span>
                    </div>

                    {/* Macro bar */}
                    <MacroBar p={meal.p} c={meal.c} f={meal.f} cal={meal.cal}/>

                    {/* Action buttons */}
                    {!isSwapping && !isExpanded && (
                      <div style={{display:'flex',gap:8,marginTop:10}}>
                        <button className="btn" onClick={()=>{setExpandedCard(slot);setSwapping(null);}}
                          style={smallBtn()}><ChevronDown size={12}/> Details</button>
                        <button className="btn" onClick={()=>{setSwapping(slot);setExpandedCard(null);}}
                          style={smallBtn()}>Swap</button>
                      </div>
                    )}

                    {/* Swap list */}
                    {isSwapping && (
                      <div style={{marginTop:10}}>
                        <div style={{maxHeight:220,overflowY:'auto',borderTop:`1px solid ${COLORS.border}`,paddingTop:8,marginBottom:8}}>
                          {list.map(m=>(
                            <button key={m.name} onClick={()=>swapMeal(slot,m.name)}
                              style={{display:'block',width:'100%',textAlign:'left',background:m.name===meal.name?COLORS.peach:'transparent',border:'none',padding:'6px 8px',fontSize:12,cursor:'pointer',borderRadius:6,color:COLORS.dark,fontFamily:'inherit'}}>
                              {m.name===meal.name&&<Check size={11} style={{display:'inline',marginRight:4}}/>}
                              <span style={{fontWeight:500}}>{m.name}</span>
                              <span style={{color:COLORS.muted,marginLeft:4}}>· {m.cal} cal · {m.p}g p</span>
                            </button>
                          ))}
                        </div>
                        <button onClick={()=>setSwapping(null)}
                          style={{background:'none',border:`1px solid ${COLORS.track}`,borderRadius:8,padding:'6px 12px',fontSize:11,cursor:'pointer',color:COLORS.mid,fontFamily:'inherit'}}>
                          <X size={11} style={{display:'inline',marginRight:4}}/>Cancel
                        </button>
                      </div>
                    )}

                    {/* Expanded: ingredients + instructions */}
                    {isExpanded && !isSwapping && (
                      <div style={{marginTop:12,borderTop:`1px solid ${COLORS.border}`,paddingTop:12}}>

                        {/* Ingredient editing toggle */}
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                          <span style={{fontSize:12,fontWeight:600,color:COLORS.muted,textTransform:'uppercase',letterSpacing:'.06em'}}>Ingredients</span>
                          <div style={{display:'flex',gap:6}}>
                            {currentIngOvr[slot]&&Object.keys(currentIngOvr[slot]).length>0&&(
                              <button className="btn" onClick={()=>resetIngOvr(slot)}
                                style={{background:'none',border:`1px solid ${COLORS.pink}`,color:COLORS.dark,borderRadius:6,padding:'3px 8px',fontSize:10,cursor:'pointer',fontFamily:'inherit'}}>Reset</button>
                            )}
                            <button className="btn" onClick={()=>setEditingSlot(isEditing?null:slot)}
                              style={{background:isEditing?COLORS.dark:COLORS.peach,color:isEditing?'#fff':COLORS.dark,border:'none',borderRadius:6,padding:'3px 8px',fontSize:10,cursor:'pointer',fontFamily:'inherit'}}>
                              <Pencil size={9} style={{display:'inline',marginRight:3}}/>{isEditing?'Done':'Edit portions'}
                            </button>
                          </div>
                        </div>

                        {/* Ingredient rows */}
                        <div style={{display:'flex',flexDirection:'column',gap:4,marginBottom:12}}>
                          {meal.ing.map((ing,idx)=>(
                            <IngredientRow key={idx} ing={ing} editing={isEditing}
                              onChange={qty=>updateIngQty(slot,idx,qty)}/>
                          ))}
                        </div>

                        {/* Instructions */}
                        {hasInstr && (
                          <div>
                            <div style={{fontSize:12,fontWeight:600,color:COLORS.muted,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6,display:'flex',alignItems:'center',gap:6}}>
                              <BookOpen size={12}/> Method
                            </div>
                            <ol style={{margin:0,paddingLeft:18,display:'flex',flexDirection:'column',gap:6}}>
                              {meal.instructions.map((step,i)=>(
                                <li key={i} style={{fontSize:12,color:COLORS.mid,lineHeight:1.5}}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        <div style={{display:'flex',gap:8,marginTop:12}}>
                          <button className="btn" onClick={()=>{setSwapping(slot);setExpandedCard(null);setEditingSlot(null);}}
                            style={smallBtn()}>Swap meal</button>
                          <button className="btn" onClick={()=>{setExpandedCard(null);setEditingSlot(null);}}
                            style={smallBtn()}><ChevronUp size={12}/> Close</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add custom meal button */}
            <button className="btn" onClick={()=>{setShowCustomForm(true);}}
              style={{marginTop:14,width:'100%',background:'none',border:`2px dashed ${COLORS.track}`,borderRadius:14,padding:'12px',fontSize:13,fontWeight:600,color:COLORS.muted,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:'inherit'}}>
              <Plus size={16}/> Add your own meal
            </button>
          </div>
        )}

        {/* ── CUSTOM MEAL FORM ──────────────────────────────────── */}
        {showCustomForm && (
          <CustomMealForm customMeals={customMeals} onSave={addCustomMeal} onCancel={()=>setShowCustomForm(false)}/>
        )}

        {/* ── SHOPPING LIST ─────────────────────────────────────── */}
        {(trainingDayCount>0||restDayCount>0) && (
          <div style={{background:COLORS.white,borderRadius:24,padding:28,boxShadow:'0 4px 20px rgba(26,58,54,.08)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12}}>
              <SectionHeader icon={<ShoppingBasket size={18}/>}
                title={`Shopping list — ${totalDays} day${totalDays>1?'s':''}`}
                sub={`${trainingDayCount>0?`Training ×${trainingDayCount}`:''}${trainingDayCount>0&&restDayCount>0?' + ':''}${restDayCount>0?`Rest ×${restDayCount}`:''}`}
                noMargin />
              <div style={{display:'flex',gap:8}}>
                <div style={{display:'flex',background:COLORS.peach,borderRadius:10,padding:3}}>
                  {[['category','By category'],['combined','All items'],['permeal','Per meal']].map(([v,lbl])=>(
                    <button key={v} onClick={()=>setShopView(v)} style={tabBtn(shopView===v)}>{lbl}</button>
                  ))}
                </div>
                <Btn dark small onClick={exportList}><Download size={13}/>Export</Btn>
              </div>
            </div>

            {shopView==='category' && (
              <div>
                {CATEGORY_ORDER.map(cat=>{
                  const items=shopByCategory[cat];
                  if (!items||!items.length) return null;
                  return (
                    <div key={cat} style={{marginBottom:20}}>
                      <div style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:COLORS.muted,marginBottom:8,paddingBottom:4,borderBottom:`1px solid ${COLORS.border}`}}>{cat}</div>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:4}}>
                        {items.map((i,idx)=><CheckItem key={idx} label={i.item} qty={fmtQty(i.qty,i.unit)}/>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {shopView==='combined' && (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:6}}>
                {shopCombined.map((i,idx)=><CheckItem key={idx} label={i.item} qty={fmtQty(i.qty,i.unit)}/>)}
              </div>
            )}

            {shopView==='permeal' && (
              <div>
                {['Training','Rest'].map(label=>{
                  const items=shopPerMeal.filter(m=>m.dayLabel===label);
                  if (!items.length) return null;
                  return (
                    <div key={label} style={{marginBottom:20}}>
                      <div style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:COLORS.muted,marginBottom:8}}>{label} days</div>
                      {items.filter((m,i,a)=>a.findIndex(x=>x.mealName===m.mealName&&x.slot===m.slot)===i).map((m,idx)=>(
                        <PerMealAccordion key={idx} m={m}/>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div style={{textAlign:'center',fontSize:12,color:COLORS.muted,marginTop:24,lineHeight:1.6}}>
          From Fit with Jade · {MEALS.preworkout.length} pre-workouts · {MEALS.breakfast.length} breakfasts · {MEALS.lunch.length} lunches · {MEALS.dinner.length} dinners · {MEALS.snack.length} snacks
        </div>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────

function SliderField({label,value,min,max,step,onChange,marks,sub}) {
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:8}}>
        <label style={{fontSize:12,opacity:.75,textTransform:'uppercase',letterSpacing:'.08em'}}>{label}</label>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <input type="number" value={value} min={min} max={max} step={step}
            onChange={e=>onChange(Math.min(max,Math.max(min,Number(e.target.value))))}
            style={{width:44,fontSize:20,fontWeight:700,background:'transparent',border:'none',color:'#fff',textAlign:'right',fontFamily:'inherit',outline:'none'}}/>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/>
      {marks && <div style={{display:'flex',justifyContent:'space-between',fontSize:10,opacity:.6,marginTop:4}}>{marks.map(m=><span key={m}>{m}</span>)}</div>}
      {sub && <div style={{marginTop:4}}>{sub}</div>}
    </div>
  );
}

function DayTypeControl({icon,label,accent,cal,setCal,protein,setProtein,defaultCal,defaultProtein}) {
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${COLORS.border}`}}>
        <div style={{background:accent,width:28,height:28,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:COLORS.dark}}>{icon}</div>
        <h3 style={{margin:0,fontSize:14,fontWeight:700,color:COLORS.dark}}>{label}</h3>
      </div>
      {[{lbl:'Calories',icon:<Flame size={12} style={{color:COLORS.muted}}/>,val:cal,set:setCal,min:1500,max:3500,step:25,def:defaultCal,unit:''},
        {lbl:'Protein',icon:<Beef size={12} style={{color:COLORS.muted}}/>,val:protein,set:setProtein,min:80,max:260,step:1,def:defaultProtein,unit:'g'}
      ].map(({lbl,icon:ic,val,set,min,max,step,def,unit})=>(
        <div key={lbl} style={{marginBottom:14}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>{ic}<label style={{fontSize:11,fontWeight:600,color:COLORS.mid,textTransform:'uppercase',letterSpacing:'.06em'}}>{lbl}</label></div>
            <input type="number" value={val} min={min} max={max} step={step}
              onChange={e=>set(Math.min(max,Math.max(min,Number(e.target.value))))}
              style={{width:60,fontSize:18,fontWeight:700,color:COLORS.dark,border:`1px solid ${COLORS.border}`,borderRadius:6,padding:'2px 4px',textAlign:'right',fontFamily:'inherit',outline:'none'}}/>
          </div>
          <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(Number(e.target.value))}/>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:COLORS.muted,marginTop:2}}>
            <span>{min}{unit}</span>
            <button onClick={()=>set(def)} style={{background:'none',border:'none',color:COLORS.mid,fontSize:10,cursor:'pointer',textDecoration:'underline',fontFamily:'inherit'}}>{def}{unit}</button>
            <span>{max}{unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MacroBar({p,c,f,cal}) {
  const total=p*4+c*4+f*9||1;
  const pW=p*4/total*100, cW=c*4/total*100, fW=f*9/total*100;
  return (
    <div style={{height:6,borderRadius:3,overflow:'hidden',display:'flex',marginBottom:6}}>
      <div style={{width:`${pW}%`,background:COLORS.purple}}/>
      <div style={{width:`${cW}%`,background:COLORS.yellow}}/>
      <div style={{width:`${fW}%`,background:COLORS.green}}/>
    </div>
  );
}

function MacroStat({icon,label,value,target,accent,bar}) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div style={{background:accent,width:34,height:34,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',color:COLORS.dark,flexShrink:0}}>{icon}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:10,color:COLORS.muted,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
        <div style={{fontSize:18,fontWeight:700,color:COLORS.dark}}>
          {value}{target&&<span style={{fontSize:11,color:COLORS.muted,fontWeight:500}}> / {target}</span>}
        </div>
        {bar!==undefined&&<div style={{height:4,background:COLORS.border,borderRadius:2,marginTop:3}}><div style={{height:'100%',width:`${Math.min(100,bar*100)}%`,background:accent,borderRadius:2}}/></div>}
      </div>
    </div>
  );
}

function IngredientRow({ing,editing,onChange}) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 0',borderBottom:`1px solid ${COLORS.border}`}}>
      <div style={{flex:1,fontSize:12,color:COLORS.dark}}>{ing.item}</div>
      {editing ? (
        <div style={{display:'flex',alignItems:'center',gap:4,flexShrink:0}}>
          <input type="number" defaultValue={ing.qty} min={0} step={ing.qty<=5?0.5:5}
            onChange={e=>onChange(e.target.value)}
            style={{width:52,fontSize:12,border:`1px solid ${COLORS.track}`,borderRadius:6,padding:'2px 4px',textAlign:'right',fontFamily:'inherit',outline:'none'}}/>
          <span style={{fontSize:11,color:COLORS.muted,width:14}}>{ing.unit}</span>
        </div>
      ) : (
        <span style={{fontSize:12,color:COLORS.muted,fontWeight:600,flexShrink:0}}>{fmtQty(ing.qty,ing.unit)}</span>
      )}
      <span style={{fontSize:11,color:COLORS.muted,flexShrink:0,width:50,textAlign:'right'}}>{ing.cal} cal</span>
    </div>
  );
}

function SectionHeader({icon,title,sub,noMargin,right}) {
  return (
    <div style={{marginBottom:noMargin?0:14,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
      <div>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
          <span style={{color:COLORS.dark}}>{icon}</span>
          <h2 style={{margin:0,fontSize:20,fontWeight:700,color:COLORS.dark}}>{title}</h2>
        </div>
        {sub&&<div style={{fontSize:13,color:COLORS.muted,marginLeft:26}}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function Btn({children,onClick,dark,small}) {
  return (
    <button className="btn" onClick={onClick} style={{
      display:'flex',alignItems:'center',justifyContent:'center',gap:8,
      background:dark?COLORS.dark:COLORS.peach, color:dark?'#fff':COLORS.dark,
      border:'none',borderRadius:small?8:12,
      padding:small?'8px 12px':'12px 18px',
      fontWeight:600,fontSize:small?12:14,cursor:'pointer',fontFamily:'inherit',
      width:small?undefined:'100%',
    }}>{children}</button>
  );
}

function ModeTab({children,active,onClick}) {
  return (
    <button onClick={onClick} style={{flex:1,background:active?COLORS.dark:'transparent',color:active?'#fff':COLORS.dark,border:'none',borderRadius:10,padding:'12px 16px',fontWeight:600,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:'inherit'}}>{children}</button>
  );
}

function CheckItem({label,qty}) {
  const [checked,setChecked]=useState(false);
  return (
    <button onClick={()=>setChecked(c=>!c)} style={{display:'flex',alignItems:'center',gap:10,background:'none',border:'none',padding:'6px 8px',cursor:'pointer',textAlign:'left',borderRadius:8,fontFamily:'inherit',width:'100%'}}>
      <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${checked?COLORS.dark:COLORS.track}`,background:checked?COLORS.dark:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .15s'}}>
        {checked&&<Check size={12} color="#fff"/>}
      </div>
      <div style={{flex:1,fontSize:13,color:checked?COLORS.muted:COLORS.dark,textDecoration:checked?'line-through':'none'}}>
        <span style={{fontWeight:500}}>{label}</span>
        <span style={{color:COLORS.muted,fontWeight:600,marginLeft:8}}>{qty}</span>
      </div>
    </button>
  );
}

function PerMealAccordion({m}) {
  const [open,setOpen]=useState(false);
  return (
    <div style={{marginBottom:8,border:`1px solid ${COLORS.border}`,borderRadius:12,overflow:'hidden'}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',background:'#f9f5f1',border:'none',padding:'10px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',fontFamily:'inherit'}}>
        <span style={{fontWeight:600,fontSize:13,color:COLORS.dark}}>{SECTION_META[m.slot].icon} {m.mealName}</span>
        {open?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
      </button>
      {open&&(
        <div style={{padding:'10px 14px',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:4}}>
          {m.ingredients.map((i,ix)=><CheckItem key={ix} label={i.item} qty={fmtQty(i.qty,i.unit)}/>)}
        </div>
      )}
    </div>
  );
}

function CustomMealForm({customMeals,onSave,onCancel}) {
  const [slot,setSlot]=useState('lunch');
  const [name,setName]=useState('');
  const [cal,setCal]=useState('');
  const [protein,setProtein]=useState('');
  const [carbs,setCarbs]=useState('');
  const [fats,setFats]=useState('');
  const [instructions,setInstructions]=useState('');
  const [ings,setIngs]=useState([{item:'',qty:'',unit:'g'}]);

  const addIng=()=>setIngs(i=>[...i,{item:'',qty:'',unit:'g'}]);
  const updateIng=(idx,field,val)=>setIngs(i=>i.map((x,j)=>j===idx?{...x,[field]:val}:x));
  const removeIng=(idx)=>setIngs(i=>i.filter((_,j)=>j!==idx));

  const save=()=>{
    if (!name.trim()||!cal) return;
    const ingList=ings.filter(i=>i.item.trim()).map(i=>({
      item:i.item.trim(),qty:Number(i.qty)||0,unit:i.unit,cal:0,c:0,f:0,p:0
    }));
    onSave({
      slot,name:name.trim(),
      cal:Number(cal),c:Number(carbs)||0,f:Number(fats)||0,p:Number(protein)||0,
      ing:ingList,
      instructions:instructions.trim()?instructions.trim().split('\n').filter(Boolean):null,
    });
  };

  return (
    <div style={{background:COLORS.white,borderRadius:24,padding:28,marginBottom:20,boxShadow:'0 4px 20px rgba(26,58,54,.08)'}}>
      <SectionHeader icon={<Plus size={18}/>} title="Add custom meal"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16,marginBottom:16}}>
        {/* Slot */}
        <div>
          <label style={fieldLbl()}>Meal type</label>
          <select value={slot} onChange={e=>setSlot(e.target.value)} style={fieldInput()}>
            {SLOTS.map(s=><option key={s} value={s}>{SECTION_META[s].label}</option>)}
          </select>
        </div>
        {/* Name */}
        <div style={{gridColumn:'span 2'}}>
          <label style={fieldLbl()}>Meal name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Mum's chicken soup" style={fieldInput()}/>
        </div>
        {/* Macros */}
        {[['Calories',cal,setCal],['Protein (g)',protein,setProtein],['Carbs (g)',carbs,setCarbs],['Fats (g)',fats,setFats]].map(([lbl,v,sv])=>(
          <div key={lbl}>
            <label style={fieldLbl()}>{lbl}</label>
            <input type="number" value={v} onChange={e=>sv(e.target.value)} placeholder="0" style={fieldInput()}/>
          </div>
        ))}
      </div>

      {/* Ingredients */}
      <div style={{marginBottom:16}}>
        <div style={{fontWeight:600,fontSize:13,color:COLORS.dark,marginBottom:8}}>Ingredients</div>
        {ings.map((ing,idx)=>(
          <div key={idx} style={{display:'flex',gap:8,marginBottom:6,alignItems:'center'}}>
            <input value={ing.item} onChange={e=>updateIng(idx,'item',e.target.value)} placeholder="Ingredient name" style={{...fieldInput(),flex:2}}/>
            <input type="number" value={ing.qty} onChange={e=>updateIng(idx,'qty',e.target.value)} placeholder="Qty" style={{...fieldInput(),width:64}}/>
            <select value={ing.unit} onChange={e=>updateIng(idx,'unit',e.target.value)} style={{...fieldInput(),width:60}}>
              {['g','ml',''].map(u=><option key={u} value={u}>{u||'×'}</option>)}
            </select>
            <button onClick={()=>removeIng(idx)} style={{background:'none',border:'none',cursor:'pointer',color:COLORS.muted,flexShrink:0}}><X size={14}/></button>
          </div>
        ))}
        <button className="btn" onClick={addIng} style={{background:'none',border:`1px dashed ${COLORS.track}`,borderRadius:8,padding:'6px 12px',fontSize:12,cursor:'pointer',color:COLORS.muted,fontFamily:'inherit',display:'flex',alignItems:'center',gap:6}}>
          <Plus size={12}/> Add ingredient
        </button>
      </div>

      {/* Instructions */}
      <div style={{marginBottom:20}}>
        <label style={fieldLbl()}>Instructions (one step per line, optional)</label>
        <textarea value={instructions} onChange={e=>setInstructions(e.target.value)} rows={4} placeholder="Step 1&#10;Step 2&#10;Step 3" style={{...fieldInput(),resize:'vertical',width:'100%'}}/>
      </div>

      <div style={{display:'flex',gap:10}}>
        <Btn dark onClick={save}><Check size={16}/> Save meal</Btn>
        <button className="btn" onClick={onCancel} style={{...smallBtn(),padding:'12px 18px',fontSize:14}}><X size={16}/> Cancel</button>
      </div>
    </div>
  );
}

// ─── style helpers ────────────────────────────────────────────────
function smallBtn() {
  return {background:COLORS.peach,color:COLORS.dark,border:'none',borderRadius:8,padding:'7px 10px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontFamily:'inherit'};
}
function tabBtn(active) {
  return {background:active?COLORS.dark:'transparent',color:active?'#fff':COLORS.dark,border:'none',borderRadius:8,padding:'7px 14px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'};
}
function fieldLbl() {
  return {display:'block',fontSize:11,fontWeight:600,color:COLORS.mid,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4};
}
function fieldInput() {
  return {width:'100%',border:`1px solid ${COLORS.border}`,borderRadius:8,padding:'8px 10px',fontSize:13,fontFamily:'inherit',color:COLORS.dark,outline:'none',background:COLORS.white};
}
