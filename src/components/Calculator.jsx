import { toast } from 'react-toastify';
import { calcBMR, calcTDEE, getBMICat, getBodyFat } from '../utils/utils';
import { forwardRef, useState } from 'react';



export const Calculator = forwardRef(({ onResults }, ref) => {
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
  const goalCls  = (active) => `flex-1 flex flex-col items-center gap-[6px] py-3.5 px-2 bg-bg border-[1.5px] rounded-[11px] text-[13px] font-medium font-body cursor-pointer transition-all ${active?'border-green text-green bg-green-light font-semibold':'border-border text-muted'}`

  return (
    <div ref={ref} className="calc-card bg-surface rounded-card shadow-card-lg overflow-hidden mb-8 border border-border">
      {/* Card header */}
      <div className="bg-linear-to-br from-green to-green-700 px-9 py-7 flex items-center gap-4">
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
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted font-medium pointer-events-none">yrs</span>
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
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted font-medium pointer-events-none">{unit==='metric'?'cm':'in'}</span>
            </div>
          </div>

          {/* Weight */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">Weight</label>
            <div className="relative">
              <input className={inputCls} type="number" placeholder={unit==='metric'?'70':'154'} value={weight} onChange={e=>setWeight(e.target.value)} style={{paddingRight:'48px'}}/>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted font-medium pointer-events-none">{unit==='metric'?'kg':'lbs'}</span>
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
          className="w-full flex items-center justify-center gap-2.5 bg-green text-white 
            rounded-[13px] py-4.5 font-body text-[17px] font-semibold cursor-pointer transition-all 
            hover:bg-green-mid hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(28,74,46,0.25)] 
            disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
          {loading
            ? <><div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin-fast"/>&nbsp;Calculating...</>
            : <><span>⚡</span> Calculate My BMI &amp; Get My Plan</>}
        </button>

        {error && <div className="bg-danger-light border border-danger/20 rounded-[10px] px-4 py-3 text-danger text-sm mt-3.5">⚠ {error}</div>}
      </div>
    </div>
  )
})