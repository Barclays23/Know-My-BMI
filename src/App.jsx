/* THE NEW APP.JSX */

import { useState, useEffect, useRef } from 'react'
import appleImg from './assets/images/green-apple1.png'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { calcBMR, calcTDEE, getBMICat, getBodyFat, getDietData, getExerciseData } from './utils/utils';
import { ACT_LABELS, BMI_MEANINGS, GOAL_LABELS, HEALTH_TIPS } from './constants/constants';


// ── COMPONENTS ───────────────────────────────────────────────────────

function Header() {
  return (
    <header className="bg-green sticky top-0 z-[100] px-[5%]">
      <div className="max-w-content mx-auto flex items-center justify-between h-16">
        <div className="font-display text-2xl font-bold text-white tracking-[-0.5px]">
          Know<span className="text-green-accent">MyBMI</span>
        </div>
        <div className="text-xs text-white/50 font-light tracking-[0.06em] hidden sm:block">
          Know Your Body. Transform Your Life.
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <div className="hero-glow bg-green relative overflow-hidden min-h-[420px] flex items-center px-[5%] pt-20 pb-24">

      {/* Apple ring */}
      <div
        className="apple-ring absolute top-1/2 -translate-y-1/2 right-[-40px] rounded-full border border-green-accent/[0.08] z-[1] pointer-events-none animate-apple-drift"
        style={{ width:'clamp(330px,40vw,540px)', height:'clamp(330px,40vw,540px)' }}
      />

      {/* Apple image */}
      <img
        src={appleImg}
        alt=""
        draggable="false"
        className="absolute top-1/2 -translate-y-1/2 right-[-40px] object-contain opacity-[0.83] blur-[0.5px] saturate-150 brightness-110 z-[2] pointer-events-none select-none animate-apple-drift max-sm:opacity-[0.07]"
        style={{ width:'clamp(320px,38vw,520px)', height:'clamp(320px,38vw,520px)' }}
      />

      {/* Content */}
      <div className="relative z-[3] max-w-[600px]">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-green-accent border border-green-accent/25 rounded-full px-[14px] py-[5px] mb-6 backdrop-blur-sm bg-green-accent/5">
          ✦ Free · Accurate · No Signup
        </div>

        <h1 className="font-display font-bold text-white leading-[1.05] tracking-[-1.5px] mb-5" style={{fontSize:'clamp(40px,6vw,76px)'}}>
          Know Your Body.<br /><em className="italic text-green-accent">Transform</em> Your Life.
        </h1>

        <p className="text-white/60 font-light leading-[1.7] mb-8 max-w-[480px]" style={{fontSize:'clamp(15px,1.8vw,17px)'}}>
          Advanced BMI analysis with personalized diet &amp; exercise plans — built for real results, not generic advice.
        </p>

        <div className="flex flex-wrap gap-[10px]">
          {[['⚡','Instant Results'],['🎯','Personalized Plans'],['🔒','No Account Needed'],['🥗','Diet + Exercise']].map(([icon,label])=>(
            <div key={label} className="flex items-center gap-[7px] text-xs font-medium text-white/75 bg-white/[0.06] border border-white/10 rounded-full px-[14px] py-[7px] backdrop-blur-sm">
              <span className="text-sm">{icon}</span> {label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <svg className="absolute bottom-[-1px] left-0 right-0 z-[3]" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 48L1440 48L1440 12C1200 40 960 4 720 20C480 36 240 8 0 28L0 48Z" fill="#f7f4ef"/>
      </svg>
    </div>
  )
}


import { forwardRef } from 'react';

const Calculator = forwardRef(({ onResults }, ref) => {
  const [unit, setUnit]       = useState('metric')
  const [sex, setSex]         = useState('male')
  const [goal, setGoal]       = useState('lose')
  const [age, setAge]         = useState('')
  const [height, setHeight]   = useState('')
  const [weight, setWeight]   = useState('')
  const [activity, setActivity] = useState('moderate')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)




  function calculate() {
    const ageVal=parseInt(age), h=parseFloat(height), w=parseFloat(weight)
    // Validation Errors
    if (!ageVal || ageVal < 5 || ageVal > 120) {
      setError('Please enter a valid age (5–120)')
      toast.error("Please enter a valid age (5–120)");
      return 
    }
    if (!h || h <= 0) {
      setError('Please enter your height')
      toast.error("Please enter your height");
      return 
    }
    if (!w || w <= 0) {
      setError('Please enter your weight')
      toast.error("Please enter your weight");
      return 
    }
    setError(''); setLoading(true)

    setTimeout(()=>{
      const hCm=unit==='imperial'?h*2.54:h
      const wKg=unit==='imperial'?w*0.453592:w
      const bmi=parseFloat((wKg/Math.pow(hCm/100,2)).toFixed(1))
      const cat=getBMICat(bmi)
      const bmr=calcBMR(wKg,hCm,ageVal,sex)
      const tdee=calcTDEE(bmr,activity)
      const bf=getBodyFat(bmi,ageVal,sex)
      const adjust={lose:-500,maintain:0,gain:300}
      const targetCal=tdee+(adjust[goal]||0)
      const idealMin=parseFloat((18.5*Math.pow(hCm/100,2)).toFixed(1))
      const idealMax=parseFloat((24.9*Math.pow(hCm/100,2)).toFixed(1))
      const idealStr=unit==='imperial'
        ?`${(idealMin/0.453592).toFixed(0)}–${(idealMax/0.453592).toFixed(0)} lbs`
        :`${idealMin}–${idealMax} kg`
      onResults({bmi,cat,bmr,tdee,bf,targetCal,idealStr,ageVal,hCm,wKg,h,w,unit,sex,activity,goal})
      setLoading(false)
    },600)
  }


  const inputCls = "w-full bg-bg border-[1.5px] border-border rounded-[11px] px-4 py-[13px] font-body text-base font-medium text-[#1e2d1e] outline-none transition-all focus:border-green focus:shadow-glow"
  const selCls   = `${inputCls} appearance-none pr-10 cursor-pointer text-sm font-normal`
  const choiceCls= (active) => `flex-1 flex items-center justify-center gap-[6px] py-3 px-2 bg-bg border-[1.5px] rounded-[11px] text-[13px] font-medium font-body cursor-pointer transition-all ${active?'border-green text-green bg-green-light':'border-border text-muted'}`
  const goalCls  = (active) => `flex-1 flex flex-col items-center gap-[6px] py-[14px] px-2 bg-bg border-[1.5px] rounded-[11px] text-[13px] font-medium font-body cursor-pointer transition-all ${active?'border-green text-green bg-green-light font-semibold':'border-border text-muted'}`

  return (
    <div ref={ref} className="calc-card bg-surface rounded-card shadow-card-lg overflow-hidden mb-8 border border-border">
      {/* Card header */}
      <div className="bg-gradient-to-br from-green to-green-mid px-9 py-7 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-green-accent/15 flex items-center justify-center text-[22px]">⚖️</div>
        <div>
          <h2 className="font-display text-[22px] font-semibold text-white">Your Body Analysis</h2>
          <p className="text-[13px] text-white/55 font-light">Fill in your details — takes 30 seconds</p>
        </div>
      </div>

      <div className="p-9">
        {/* Unit toggle */}
        <div className="flex bg-bg2 rounded-[10px] p-1 w-fit mb-8">
          {['metric','imperial'].map(u=>(
            <button key={u} onClick={()=>setUnit(u)}
              className={`px-6 py-2 rounded-[7px] text-sm font-medium font-body cursor-pointer transition-all ${unit===u?'bg-green text-white':'bg-transparent text-muted'}`}>
              {u.charAt(0).toUpperCase()+u.slice(1)}
            </button>
          ))}
        </div>

        {/* Form grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-5">
          {/* Age */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">Age</label>
            <div className="relative">
              <input className={inputCls} type="number" placeholder="25" min="5" max="120" value={age} onChange={e=>setAge(e.target.value)} style={{paddingRight:'48px'}}/>
              <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-xs text-muted font-medium pointer-events-none">yrs</span>
            </div>
          </div>

          {/* Sex */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">Sex</label>
            <div className="flex gap-2">
              <button className={choiceCls(sex==='male')}   onClick={()=>setSex('male')}>♂ Male</button>
              <button className={choiceCls(sex==='female')} onClick={()=>setSex('female')}>♀ Female</button>
            </div>
          </div>

          {/* Height */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">Height</label>
            <div className="relative">
              <input className={inputCls} type="number" placeholder={unit==='metric'?'170':'67'} value={height} onChange={e=>setHeight(e.target.value)} style={{paddingRight:'48px'}}/>
              <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-xs text-muted font-medium pointer-events-none">{unit==='metric'?'cm':'in'}</span>
            </div>
          </div>

          {/* Weight */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">Weight</label>
            <div className="relative">
              <input className={inputCls} type="number" placeholder={unit==='metric'?'70':'154'} value={weight} onChange={e=>setWeight(e.target.value)} style={{paddingRight:'48px'}}/>
              <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-xs text-muted font-medium pointer-events-none">{unit==='metric'?'kg':'lbs'}</span>
            </div>
          </div>

          {/* Activity */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-3">
            <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">Activity Level</label>
            <div className="relative">
              <select className={selCls} value={activity} onChange={e=>setActivity(e.target.value)}
                style={{backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%237a8c7a' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 16px center'}}>
                <option value="sedentary">🛋️  Sedentary — Desk job, little exercise</option>
                <option value="light">🚶  Lightly Active — Light exercise 1–2 days/week</option>
                <option value="moderate">🏃  Moderately Active — Exercise 3–5 days/week</option>
                <option value="active">💪  Very Active — Hard exercise 6–7 days/week</option>
                <option value="extreme">🔥  Extra Active — Athlete / physical job</option>
              </select>
            </div>
          </div>

          {/* Goal */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-3">
            <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">Primary Goal</label>
            <div className="flex gap-2">
              <button className={goalCls(goal==='lose')}     onClick={()=>setGoal('lose')}><span className="text-[22px]">📉</span>Lose Weight</button>
              <button className={goalCls(goal==='maintain')} onClick={()=>setGoal('maintain')}><span className="text-[22px]">⚖️</span>Maintain</button>
              <button className={goalCls(goal==='gain')}     onClick={()=>setGoal('gain')}><span className="text-[22px]">💪</span>Gain Muscle</button>
            </div>
          </div>
        </div>

        <div className="h-px bg-border my-7" />

        <button onClick={calculate} disabled={loading}
          className="w-full flex items-center justify-center gap-[10px] bg-green text-white rounded-[13px] py-[18px] font-body text-[17px] font-semibold cursor-pointer transition-all hover:bg-green-mid hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(28,74,46,0.25)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
          {loading
            ? <><div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin-fast"/>&nbsp;Calculating...</>
            : <><span>⚡</span> Calculate My BMI &amp; Get My Plan</>}
        </button>

        {error && <div className="bg-danger-light border border-danger/20 rounded-[10px] px-4 py-3 text-danger text-sm mt-[14px]">⚠ {error}</div>}
      </div>
    </div>
  )
})





function BMIBanner({ data }) {
  // ── Configuration ────────────────────────────────────────
  const MIN_BMI = 10;
  const MAX_BMI = 43;
  const RANGE = MAX_BMI - MIN_BMI; // 30 units

  const circ = 2 * Math.PI * 45;

  // Clamp BMI for safe display
  const clampedBMI = Math.max(MIN_BMI, Math.min(MAX_BMI, data.bmi));

  // Progress fraction (0 to 1)
  const pct = (clampedBMI - MIN_BMI) / RANGE;
  const markerPct = pct * 100;

  // Category boundaries in percentage of the track
  const boundaries = {
    underweight: ((18.5 - MIN_BMI) / RANGE) * 100,   // ≈ 18.33%
    normal:      ((24.9 - MIN_BMI) / RANGE) * 100,   // ≈ 39.67%
    overweight:  ((29.9 - MIN_BMI) / RANGE) * 100,   // ≈ 56.33%
    // obese fills the rest to 100%
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="bg-gradient-to-br from-green to-green-mid rounded-card p-10 mb-6 text-white grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 items-center">
      <div>
        <h3 className="font-display text-lg font-normal opacity-70 mb-1">
          Your Body Mass Index
        </h3>
        <div
          className="font-display font-bold leading-none tracking-[-3px] text-green-accent"
          style={{ fontSize: 'clamp(60px, 12vw, 96px)' }}
        >
          {data.bmi}
        </div>

        <div
          className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-[6px] text-sm font-medium mt-3"
          style={{ borderColor: data.cat.color + '55', backgroundColor: data.cat.color }}
        >
          {data.cat.emoji} {data.cat.label}
        </div>

        <div className="mt-6 max-w-[360px]">
          <div className="text-[11px] text-white/50 mb-2 tracking-[0.1em] uppercase">
            BMI Scale
          </div>

          {/* Colored segmented track */}
          <div
            className="bmi-scale-track h-2 rounded-full relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, 
                #93c5fd 0%, #93c5fd ${boundaries.underweight}%, 
                #4ade80 ${boundaries.underweight}%, #4ade80 ${boundaries.normal}%, 
                #f59e0b ${boundaries.normal}%, #f59e0b ${boundaries.overweight}%, 
                #ef4444 ${boundaries.overweight}%, #ef4444 100%)`
            }}
          >
            {/* Marker */}
            <div
              className="absolute -top-[5px] w-4 h-4 rounded-full bg-white border-4 border-green-600 -translate-x-1/2 transition-all duration-1000 shadow-lg z-10"
              style={{ left: `${markerPct}%` }}
            />

            {/* Subtle boundary separators */}
            {[boundaries.underweight, boundaries.normal, boundaries.overweight].map((pos) => (
              <div
                key={pos}
                className="absolute top-0 bottom-0 w-px bg-white/40 z-0"
                style={{ left: `${pos}%` }}
              />
            ))}
          </div>

          {/* Category labels */}
          <div className="flex justify-between mt-3 text-xs text-white/70">
            <span>Underweight</span>
            <span>Normal</span>
            <span>Overweight</span>
            <span>Obese</span>
          </div>

          {/* Optional: small cutoff values above the track */}
          <div className="relative h-5 mt-1 text-[9px] text-white/60">
            <div
              className="absolute -translate-x-1/2"
              style={{ left: `${boundaries.underweight}%` }}
            >
              18.5
            </div>
            <div
              className="absolute -translate-x-1/2"
              style={{ left: `${boundaries.normal}%` }}
            >
              25
            </div>
            <div
              className="absolute -translate-x-1/2"
              style={{ left: `${boundaries.overweight}%` }}
            >
              30
            </div>
          </div>
        </div>
      </div>

      {/* Circular gauge */}
      <div className="text-center">
        <div className="relative inline-block">
          <svg className="-rotate-90" width="140" height="140" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="10"
              cx="50"
              cy="50"
              r="45"
            />

            {/* Progress arc - colored by category */}
            <circle
              className="gauge-fill transition-all duration-1000"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: circ,
                strokeDashoffset: circ * (1 - pct),
                stroke: data.cat.color,
              }}
            />
          </svg>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="font-display text-[28px] font-bold text-white leading-none">
              {data.bmi}
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-[0.1em]">
              BMI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function StatsGrid({ data }) {
  const goalLabels={lose:'For weight loss (−500 kcal)',maintain:'For maintenance',gain:'For muscle gain (+300 kcal)'}
  const cards=[
    {icon:'🔥',label:'Daily Calories',val:data.targetCal.toLocaleString()+' kcal',sub:goalLabels[data.goal]},
    {icon:'⚙️',label:'BMR',val:data.bmr.toLocaleString()+' kcal',sub:'Calories at rest'},
    {icon:'🎯',label:'Ideal Weight',val:data.idealStr,sub:'Healthy BMI range'},
    {icon:'📊',label:'Est. Body Fat',val:data.bf+'%',sub:'Estimation (Navy method)'},
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {cards.map(c=>(
        <div key={c.label} className="bg-surface border border-border rounded-2xl p-5 shadow-card transition-transform hover:-translate-y-0.5">
          <div className="text-[22px] mb-[10px]">{c.icon}</div>
          <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-muted mb-1">{c.label}</div>
          <div className="font-display text-[28px] font-bold text-[#1e2d1e] leading-[1.1]">{c.val}</div>
          <div className="text-xs text-muted mt-0.5">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

function OverviewTab({ data }) {
  const protein=data.goal==='gain'?Math.round(data.wKg*2.2):data.goal==='lose'?Math.round(data.wKg*2.0):Math.round(data.wKg*1.8)
  const blockCls="bg-bg rounded-2xl p-5"
  const rowCls="flex justify-between items-center py-2 border-b border-border text-sm last:border-b-0"
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className={blockCls}>
          <h4 className="text-[13px] font-semibold text-green uppercase tracking-[0.1em] mb-3">Your Metrics</h4>
          {[['Age',data.ageVal+' years'],['Height',data.unit==='imperial'?data.h+' in ('+data.hCm.toFixed(0)+' cm)':data.hCm.toFixed(0)+' cm'],['Weight',data.unit==='imperial'?data.w+' lbs ('+data.wKg.toFixed(1)+' kg)':data.wKg.toFixed(1)+' kg'],['Sex',data.sex.charAt(0).toUpperCase()+data.sex.slice(1)],['Activity',ACT_LABELS[data.activity]],['Goal',GOAL_LABELS[data.goal]]].map(([l,v])=>(
            <div className={rowCls} key={l}><span className="text-muted">{l}</span><span className="font-semibold text-[#1e2d1e]">{v}</span></div>
          ))}
        </div>
        <div className={blockCls}>
          <h4 className="text-[13px] font-semibold text-green uppercase tracking-[0.1em] mb-3">BMI Classification</h4>
          {[['Your BMI',data.bmi],['Category',data.cat.label],['BMR',data.bmr.toLocaleString()+' kcal/day'],['Maintenance Cal.',data.tdee.toLocaleString()+' kcal/day'],['Target Cal.',data.targetCal.toLocaleString()+' kcal/day'],['Protein Target',protein+'g/day']].map(([l,v])=>(
            <div className={rowCls} key={l}><span className="text-muted">{l}</span><span className="font-semibold text-[#1e2d1e]">{v}</span></div>
          ))}
        </div>
      </div>
      <div className="bg-bg rounded-2xl p-5 mt-4">
        <h4 className="text-[13px] font-semibold text-green uppercase tracking-[0.1em] mb-2">What Your BMI Means</h4>
        <p className="text-sm text-[#1e2d1e] leading-[1.7]">{BMI_MEANINGS[data.cat.label]}</p>
      </div>
    </div>
  )
}

function DietTab({ data }) {
  const {plan,protein,carbs,fat}=getDietData(data.goal,data.targetCal,data.wKg)
  const maxMacro=Math.max(protein,carbs,fat)
  return (
    <div>
      <div className="bg-green-light rounded-2xl p-5 mb-6 flex gap-[14px] items-start">
        <div className="text-[28px] flex-shrink-0">🥗</div>
        <div><h4 className="text-[15px] font-semibold text-green mb-1">{plan.title}</h4><p className="text-[13px] text-[#1e2d1e] leading-[1.6]">{plan.desc}</p></div>
      </div>

      <div className="bg-bg rounded-2xl p-5 mb-6">
        <h4 className="text-[13px] font-semibold text-green uppercase tracking-[0.1em] mb-4">Daily Macronutrient Targets</h4>
        {[{label:'🥩 Protein',cls:'bg-green',val:protein},{label:'🍚 Carbs',cls:'bg-gold',val:carbs},{label:'🥑 Fats',cls:'bg-green-accent brightness-75',val:fat}].map((m,i)=>(
          <div key={i} className="flex items-center gap-3 mb-[10px]">
            <span className="w-20 text-[13px] font-medium">{m.label}</span>
            <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
              <div className={`macro-fill h-full rounded-full ${i===0?'bg-green':i===1?'bg-gold':'bg-green-accent'} ${i===2?'brightness-75':''}`}
                style={{width:(m.val/maxMacro*100)+'%'}}/>
            </div>
            <span className="text-[13px] font-semibold text-[#1e2d1e] whitespace-nowrap">{m.val}g</span>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {plan.meals.map((m,i)=>(
          <div key={i} className="bg-bg rounded-2xl overflow-hidden border border-border">
            <div className="px-[18px] py-[14px] bg-green flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{m.name}</span>
              <span className="text-xs text-white/60">{m.cal}</span>
            </div>
            <div className="px-[18px] py-4">
              <ul className="list-none">
                {m.items.map((item,j)=>(
                  <li key={j} className="text-sm text-[#1e2d1e] py-[5px] border-b border-border last:border-b-0 flex items-baseline gap-2">
                    <span className="text-green text-base flex-shrink-0">•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {plan.tips.map((t,i)=>{
          const parts=t.split(' '), icon=parts[0], text=parts.slice(1).join(' ')
          return(
            <div key={i} className="bg-gold-light border border-gold/15 rounded-xl p-4 flex gap-3 items-start">
              <div className="text-xl flex-shrink-0">{icon}</div>
              <div className="text-[13px] text-[#1e2d1e] leading-[1.5]">{text}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ExerciseTab({ data }) {
  const exData=getExerciseData(data.goal)
  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-6">
        {exData.week.map((d,i)=>(
          <div key={i} className={`border-[1.5px] rounded-xl px-2 py-[10px] text-center ${d.active?'border-green bg-green-light':'border-border bg-bg opacity-50'}`}>
            <div className="text-[11px] font-semibold text-muted tracking-[0.05em]">{d.day}</div>
            <div className="text-lg mt-1">{d.icon}</div>
            <div className="text-[11px] font-medium text-[#1e2d1e] mt-0.5">{d.type}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-4">
        {exData.blocks.map((b,i)=>(
          <div key={i} className="bg-bg rounded-2xl overflow-hidden border border-border">
            <div className="px-[18px] py-[14px] bg-gradient-to-r from-green to-green-mid flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{b.name}</span>
              <span className="text-[11px] font-medium bg-white/15 text-white rounded-full px-[10px] py-[3px]">{b.tag}</span>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Exercise','Sets','Reps / Duration','Rest'].map(h=>(
                    <th key={h} className="text-left px-[18px] py-[10px] text-[11px] font-semibold tracking-[0.1em] uppercase text-muted border-b border-border bg-surface">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.exercises.map((e,j)=>(
                  <tr key={j} className="border-b border-border last:border-b-0 hover:bg-green/[0.04]">
                    <td className="px-[18px] py-[11px] text-[13px]">{e.name}</td>
                    <td className="px-[18px] py-[11px] text-[13px]"><span className="inline-block text-xs font-semibold text-green bg-green-light rounded-md px-2 py-0.5">{e.sets}</span></td>
                    <td className="px-[18px] py-[11px] text-[13px]">{e.reps}</td>
                    <td className="px-[18px] py-[11px] text-[13px]">{e.rest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}

function HealthTipsTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {HEALTH_TIPS.map((t,i)=>(
        <div key={i} className="bg-bg rounded-2xl p-5 border border-border transition-all hover:-translate-y-0.5 hover:shadow-card">
          <div className="text-[28px] mb-[10px]">{t.icon}</div>
          <h4 className="text-[15px] font-semibold text-green mb-[6px]">{t.title}</h4>
          <p className="text-[13px] text-[#1e2d1e] leading-[1.6]">{t.text}</p>
        </div>
      ))}
    </div>
  )
}

function Results({ data, calculatorRef }) {
  const [activeTab, setActiveTab] = useState('overview')
  const ref=useRef(null)
  useEffect(()=>{setTimeout(()=>ref.current?.scrollIntoView({behavior:'smooth',block:'start'}),100)},[data])
  const tabs=[{id:'overview',label:'📊 Overview'},{id:'diet',label:'🥗 Diet Plan'},{id:'exercise',label:'🏋️ Exercise Plan'},{id:'tips',label:'💡 Health Tips'}]

  return (
    <div className="results-wrap animate-fade-up" ref={ref}>
      <BMIBanner data={data}/>
      <StatsGrid data={data}/>
      <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
        <div className="tabs-nav no-scrollbar flex border-b border-border overflow-x-auto bg-bg">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-[7px] px-6 py-4 font-body text-sm font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${activeTab===t.id?'text-green border-green bg-surface':'text-muted border-transparent bg-transparent'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-9">
          {activeTab==='overview'  && <OverviewTab data={data}/>}
          {activeTab==='diet'      && <DietTab data={data}/>}
          {activeTab==='exercise'  && <ExerciseTab data={data}/>}
          {activeTab==='tips'      && <HealthTipsTab/>}
        </div>
      </div>
      <div className="print-row flex justify-end gap-3 mt-6">
        <button onClick={()=>window.print()} className="flex items-center gap-[7px] px-5 py-[10px] border-[1.5px] border-green rounded-[10px] bg-transparent text-green font-body text-sm font-medium cursor-pointer transition-all hover:bg-green hover:text-white">🖨️ Print / Save PDF</button>
        <button 
          onClick={() => {
            calculatorRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }}
          className="flex items-center gap-[7px] px-5 py-[10px] border-[1.5px] border-green rounded-[10px] bg-transparent text-green font-body text-sm font-medium cursor-pointer transition-all hover:bg-green hover:text-white">↑ Recalculate</button>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-green text-white/60 text-center px-[5%] py-8 text-[13px]">
      <strong className="text-green-accent">KnowMyBMI</strong> · Advanced Body Composition Analysis
      <div className="flex justify-center gap-5 mt-2 flex-wrap">
        <span>© 2025 knowmybmi.com</span>
        <a href="#" className="text-white/50 hover:text-green-accent transition-colors">Privacy</a>
        <a href="#" className="text-white/50 hover:text-green-accent transition-colors">Disclaimer</a>
        <a href="#" className="text-white/50 hover:text-green-accent transition-colors">Contact</a>
      </div>
      <div className="text-[11px] max-w-[500px] mx-auto mt-3 opacity-60">
        Disclaimer: This tool provides general wellness information and is not a substitute for medical advice.
      </div>
    </footer>
  )
}



function ScrollTop({ calculatorRef }) {
  const [show,setShow]=useState(false)
  useEffect(()=>{
    const fn=()=>setShow(window.scrollY>300)
    window.addEventListener('scroll',fn)
    return ()=>window.removeEventListener('scroll',fn)
  },[])

  if(!show) return null

  return (
    <button 
      onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
      className="scroll-top-btn fixed bottom-6 right-6 w-11 h-11 bg-green text-white border-none rounded-full text-lg flex items-center justify-center shadow-card-lg z-50 cursor-pointer transition-all hover:bg-green-mid hover:-translate-y-0.5">
      ↑
    </button>
  )
}

export default function App() {
  const [results, setResults] = useState(null)
  const calculatorRef = useRef(null);

  return (
    <>
      <ToastContainer 
        className='z-9999'
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" 
      />
      <Header/>
      <Hero/>
      <main className="max-w-content mx-auto px-[5%] pt-12 pb-20">
        <Calculator ref={calculatorRef} onResults={setResults} />
        {results && <Results data={results} calculatorRef={calculatorRef}/>}
      </main>
      <Footer/>
      <ScrollTop />
    </>
  )
}
