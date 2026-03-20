import { useState, useEffect, useRef } from 'react'

// ── DATA ──────────────────────────────────────────────────────────────
function getBMICat(bmi) {
  if (bmi < 16)   return { label: 'Severely Underweight', color: '#e74c3c', emoji: '⚠️' }
  if (bmi < 18.5) return { label: 'Underweight',          color: '#f39c12', emoji: '📉' }
  if (bmi < 25)   return { label: 'Normal Weight',        color: '#27ae60', emoji: '✅' }
  if (bmi < 30)   return { label: 'Overweight',           color: '#f39c12', emoji: '📊' }
  if (bmi < 35)   return { label: 'Obese Class I',        color: '#e67e22', emoji: '⚠️' }
  if (bmi < 40)   return { label: 'Obese Class II',       color: '#e74c3c', emoji: '⚠️' }
  return           { label: 'Obese Class III',             color: '#c0392b', emoji: '🚨' }
}

function calcBMR(wKg, hCm, age, sex) {
  return sex === 'male'
    ? Math.round(10 * wKg + 6.25 * hCm - 5 * age + 5)
    : Math.round(10 * wKg + 6.25 * hCm - 5 * age - 161)
}

function calcTDEE(bmr, act) {
  const m = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, extreme: 1.9 }
  return Math.round(bmr * (m[act] || 1.55))
}

function getBodyFat(bmi, age, sex) {
  const bf = sex === 'male'
    ? 1.20 * bmi + 0.23 * age - 16.2
    : 1.20 * bmi + 0.23 * age - 5.4
  return Math.max(5, Math.round(bf))
}

function getDietData(goal, targetCal, wKg) {
  const protein = goal === 'gain' ? Math.round(wKg * 2.2) : goal === 'lose' ? Math.round(wKg * 2.0) : Math.round(wKg * 1.8)
  const fat = Math.round(targetCal * 0.25 / 9)
  const carbs = Math.round((targetCal - protein * 4 - fat * 9) / 4)

  const plans = {
    lose: {
      title: 'Weight Loss Diet Plan',
      desc: `Your target is ${targetCal} kcal/day with high protein to preserve muscle while burning fat. Focus on whole foods, fiber, and hydration.`,
      meals: [
        { name: '🌅 Breakfast', cal: '350–400 kcal', items: ['2 whole eggs + 2 egg whites scrambled', '1 slice whole grain toast', '½ cup oats or 1 banana', 'Black coffee or green tea (no sugar)'] },
        { name: '🍎 Morning Snack', cal: '150–200 kcal', items: ['1 apple or pear', '10 almonds or walnuts', '1 cup green tea'] },
        { name: '☀️ Lunch', cal: '400–450 kcal', items: ['150g grilled chicken breast or 200g fish', 'Large salad (lettuce, cucumber, tomato, onion)', '1 tbsp olive oil + lemon dressing', '½ cup brown rice or 1 roti/chapati'] },
        { name: '🥤 Evening Snack', cal: '150–200 kcal', items: ['1 cup low-fat yogurt / curd', '½ cup berries or papaya', 'Handful of pumpkin seeds'] },
        { name: '🌙 Dinner', cal: '350–400 kcal', items: ['150g grilled fish / tofu / paneer', 'Steamed vegetables (broccoli, beans, carrots)', 'Small bowl dal or lentil soup', 'Avoid rice after 7 PM — choose veggies'] },
      ],
      tips: ['💧 Drink 3–4 litres of water daily — often hunger is actually thirst', '🌙 Stop eating 2–3 hours before bedtime for better fat loss', '🥦 Fill half your plate with vegetables at every meal', '⏰ Try intermittent fasting: eat within an 8-hour window (e.g. 12–8 PM)', '🧂 Reduce sodium — it causes water retention and bloating', '🍳 Cook with olive oil or coconut oil instead of refined oils', '🚫 Avoid liquid calories: sodas, juices, alcohol add up fast'],
    },
    maintain: {
      title: 'Balanced Maintenance Diet Plan',
      desc: `Your target is ${targetCal} kcal/day. Focus on balanced macros and nutrient-dense foods to sustain your current healthy weight.`,
      meals: [
        { name: '🌅 Breakfast', cal: '400–450 kcal', items: ['2 whole eggs any style', '1 cup oatmeal with berries', '1 slice whole grain toast with nut butter', '1 glass low-fat milk or fortified plant milk'] },
        { name: '🍎 Morning Snack', cal: '200–250 kcal', items: ['1 handful mixed nuts and dried fruit', '1 piece of fruit (apple / banana / orange)'] },
        { name: '☀️ Lunch', cal: '500–550 kcal', items: ['150g lean protein (chicken, fish, legumes)', '1 cup cooked grains (quinoa, brown rice, oats)', 'Generous portion of vegetables', 'Olive oil drizzle + herbs'] },
        { name: '🥤 Evening Snack', cal: '200 kcal', items: ['Greek yogurt with honey', 'Carrot and cucumber sticks with hummus'] },
        { name: '🌙 Dinner', cal: '450–500 kcal', items: ['150g protein of choice', '1 medium sweet potato or 2 rotis', 'Stir-fried or steamed vegetables', '1 small bowl of soup or salad'] },
      ],
      tips: ['⚖️ Weigh yourself weekly (same time, same conditions) to track progress', '🎨 Eat a rainbow — different coloured fruits and veggies = more nutrients', '🍽️ Practice mindful eating: chew slowly, no screens at the table', '🫙 Meal prep on Sundays to avoid unhealthy choices during the week', '☕ Limit caffeine after 2 PM to maintain quality sleep and metabolism'],
    },
    gain: {
      title: 'Muscle Gain Diet Plan',
      desc: `Your target is ${targetCal} kcal/day with high protein to fuel muscle growth. Eat in a slight caloric surplus and time nutrients around training.`,
      meals: [
        { name: '🌅 Breakfast', cal: '550–600 kcal', items: ['3 whole eggs + 1 cup oatmeal', '1 banana + 1 tbsp peanut butter', '1 glass full-fat milk', 'Optional: protein shake'] },
        { name: '🏋️ Pre-Workout (1hr before)', cal: '300–350 kcal', items: ['1 banana or dates (fast carbs)', '20g whey protein or 2 boiled eggs', 'Black coffee for performance boost'] },
        { name: '☀️ Lunch', cal: '600–650 kcal', items: ['200g grilled chicken, beef or fish', '1.5 cups brown rice or pasta', 'Mixed vegetables with olive oil', '1 cup legumes (lentils, chickpeas, kidney beans)'] },
        { name: '💪 Post-Workout', cal: '250–300 kcal', items: ['25g whey protein shake', '1 banana or slice of bread', 'Electrolyte water'] },
        { name: '🌙 Dinner', cal: '550–600 kcal', items: ['200g lean protein (eggs, fish, chicken, paneer)', 'Sweet potato or 2 rotis', 'Steamed broccoli, spinach, peas', 'Full-fat yogurt or cottage cheese before bed'] },
      ],
      tips: ['🏋️ Eat within 30 minutes post-workout — protein + carbs for best muscle recovery', '😴 Sleep 8+ hours — most muscle growth happens during deep sleep', '📅 Eat every 3–4 hours to keep amino acids in your bloodstream', '🥛 Casein protein before bed (yogurt, cottage cheese) feeds muscles overnight', '💊 Consider creatine monohydrate (3–5g/day) — one of the most researched supplements'],
    },
  }
  return { plan: plans[goal], protein, carbs, fat }
}

function getExerciseData(goal) {
  const schedules = {
    lose: {
      week: [
        { day: 'Mon', type: 'Cardio',   icon: '🏃', active: true },
        { day: 'Tue', type: 'Strength', icon: '🏋️', active: true },
        { day: 'Wed', type: 'Cardio',   icon: '🚴', active: true },
        { day: 'Thu', type: 'Strength', icon: '💪', active: true },
        { day: 'Fri', type: 'HIIT',     icon: '⚡', active: true },
        { day: 'Sat', type: 'Walk',     icon: '🚶', active: true },
        { day: 'Sun', type: 'Rest',     icon: '😴', active: false },
      ],
      blocks: [
        { name: 'Monday — Cardio', tag: '45–60 min', exercises: [
          { name: 'Brisk Walking / Jogging', sets: '1',  reps: '45 min steady pace',    rest: '—'     },
          { name: 'Jump Rope',               sets: '5',  reps: '1 min on / 30 sec off', rest: '30 sec' },
          { name: 'Cycling (bike or spin)',  sets: '1',  reps: '20 min moderate',       rest: '—'     },
        ]},
        { name: 'Tuesday — Full Body Strength', tag: '40–50 min', exercises: [
          { name: 'Squats (bodyweight or goblet)', sets: '4', reps: '15 reps',           rest: '60 sec' },
          { name: 'Push-ups',                      sets: '4', reps: '12–15 reps',        rest: '60 sec' },
          { name: 'Dumbbell Rows',                 sets: '3', reps: '12 reps each side', rest: '60 sec' },
          { name: 'Lunges',                        sets: '3', reps: '12 each leg',       rest: '60 sec' },
          { name: 'Plank',                         sets: '3', reps: '45 sec hold',       rest: '30 sec' },
        ]},
        { name: 'Wednesday — Low Impact Cardio', tag: '30–45 min', exercises: [
          { name: 'Swimming or Cycling', sets: '1', reps: '30 min moderate', rest: '—' },
          { name: 'Yoga Flow / Stretching', sets: '1', reps: '15 min', rest: '—' },
        ]},
        { name: 'Thursday — Strength & Core', tag: '45 min', exercises: [
          { name: 'Deadlifts (light)',   sets: '4', reps: '12 reps', rest: '90 sec' },
          { name: 'Shoulder Press',     sets: '3', reps: '12 reps', rest: '60 sec' },
          { name: 'Bicycle Crunches',   sets: '3', reps: '20 reps', rest: '45 sec' },
          { name: 'Leg Press or Step-Ups', sets: '3', reps: '15 reps', rest: '60 sec' },
          { name: 'Russian Twists',     sets: '3', reps: '20 reps', rest: '45 sec' },
        ]},
        { name: 'Friday — HIIT Blast', tag: '25–30 min', exercises: [
          { name: 'Burpees',                    sets: '4', reps: '10 reps', rest: '30 sec' },
          { name: 'Jump Squats',                sets: '4', reps: '15 reps', rest: '30 sec' },
          { name: 'Mountain Climbers',          sets: '4', reps: '30 sec',  rest: '20 sec' },
          { name: 'High Knees',                 sets: '4', reps: '30 sec',  rest: '20 sec' },
          { name: 'Box Jumps or Squat Jumps',   sets: '3', reps: '10 reps', rest: '45 sec' },
        ]},
      ],
    },
    maintain: {
      week: [
        { day: 'Mon', type: 'Strength',   icon: '🏋️', active: true  },
        { day: 'Tue', type: 'Cardio',     icon: '🏃', active: true  },
        { day: 'Wed', type: 'Active Rest',icon: '🧘', active: true  },
        { day: 'Thu', type: 'Strength',   icon: '💪', active: true  },
        { day: 'Fri', type: 'Cardio',     icon: '🚴', active: true  },
        { day: 'Sat', type: 'Sport/Fun',  icon: '⚽', active: true  },
        { day: 'Sun', type: 'Rest',       icon: '😴', active: false },
      ],
      blocks: [
        { name: 'Monday & Thursday — Full Body Strength', tag: '45–55 min', exercises: [
          { name: 'Barbell / Goblet Squat',  sets: '4', reps: '10–12 reps', rest: '90 sec' },
          { name: 'Bench Press or Push-ups', sets: '4', reps: '10–12 reps', rest: '90 sec' },
          { name: 'Bent-Over Rows',          sets: '3', reps: '10 reps',    rest: '75 sec' },
          { name: 'Overhead Press',          sets: '3', reps: '10 reps',    rest: '75 sec' },
          { name: 'Romanian Deadlift',       sets: '3', reps: '10 reps',    rest: '90 sec' },
          { name: 'Plank or Ab Wheel',       sets: '3', reps: '45 sec',     rest: '30 sec' },
        ]},
        { name: 'Tuesday & Friday — Cardio', tag: '30–40 min', exercises: [
          { name: 'Running or Cycling', sets: '1', reps: '30 min at 60–70% max HR', rest: '—' },
          { name: 'Cool-down Walk',     sets: '1', reps: '5–10 min',                rest: '—' },
        ]},
        { name: 'Wednesday — Active Recovery', tag: '30 min', exercises: [
          { name: 'Yoga or Mobility Work', sets: '1', reps: '20 min',       rest: '—' },
          { name: 'Foam Rolling',          sets: '1', reps: '10 min full body', rest: '—' },
        ]},
      ],
    },
    gain: {
      week: [
        { day: 'Mon', type: 'Push',     icon: '🏋️', active: true  },
        { day: 'Tue', type: 'Pull',     icon: '💪', active: true  },
        { day: 'Wed', type: 'Legs',     icon: '🦵', active: true  },
        { day: 'Thu', type: 'Rest',     icon: '😴', active: false },
        { day: 'Fri', type: 'Push',     icon: '🏋️', active: true  },
        { day: 'Sat', type: 'Pull+Legs',icon: '💥', active: true  },
        { day: 'Sun', type: 'Rest',     icon: '😴', active: false },
      ],
      blocks: [
        { name: 'Monday & Friday — Push (Chest, Shoulders, Triceps)', tag: '60 min', exercises: [
          { name: 'Barbell Bench Press',          sets: '4', reps: '8–10 reps',  rest: '90 sec' },
          { name: 'Incline Dumbbell Press',       sets: '3', reps: '10–12 reps', rest: '75 sec' },
          { name: 'Overhead Shoulder Press',      sets: '4', reps: '8–10 reps',  rest: '90 sec' },
          { name: 'Lateral Raises',               sets: '3', reps: '12–15 reps', rest: '60 sec' },
          { name: 'Tricep Dips or Pushdowns',     sets: '3', reps: '12 reps',    rest: '60 sec' },
        ]},
        { name: 'Tuesday — Pull (Back, Biceps)', tag: '60 min', exercises: [
          { name: 'Pull-ups or Lat Pulldown',  sets: '4', reps: '6–10 reps',  rest: '90 sec' },
          { name: 'Barbell Rows',              sets: '4', reps: '8–10 reps',  rest: '90 sec' },
          { name: 'Seated Cable Row',          sets: '3', reps: '10–12 reps', rest: '75 sec' },
          { name: 'Face Pulls',                sets: '3', reps: '15 reps',    rest: '60 sec' },
          { name: 'Barbell or Dumbbell Curls', sets: '3', reps: '10–12 reps', rest: '60 sec' },
        ]},
        { name: 'Wednesday — Legs', tag: '60 min', exercises: [
          { name: 'Barbell Squat',    sets: '4', reps: '6–8 reps (heavy)', rest: '2 min'  },
          { name: 'Romanian Deadlift',sets: '4', reps: '8–10 reps',        rest: '90 sec' },
          { name: 'Leg Press',        sets: '3', reps: '12–15 reps',       rest: '75 sec' },
          { name: 'Walking Lunges',   sets: '3', reps: '12 each leg',      rest: '75 sec' },
          { name: 'Calf Raises',      sets: '4', reps: '15–20 reps',       rest: '45 sec' },
        ]},
        { name: 'Saturday — Push + Pull Combined (Volume Day)', tag: '75 min', exercises: [
          { name: 'Deadlift',                              sets: '5', reps: '5 reps (max strength)',  rest: '2–3 min' },
          { name: 'Dumbbell Bench Press',                  sets: '3', reps: '10–12 reps',            rest: '75 sec'  },
          { name: 'Pull-ups',                              sets: '3', reps: 'Max reps',               rest: '90 sec'  },
          { name: 'Arnold Press',                          sets: '3', reps: '10 reps',                rest: '75 sec'  },
          { name: 'Hammer Curls + Tricep Extensions',      sets: '3', reps: '12 reps each',           rest: '60 sec'  },
        ]},
      ],
    },
  }
  return schedules[goal]
}

const HEALTH_TIPS = [
  { icon: '💧', title: 'Stay Hydrated',       text: 'Drink at least 8 glasses (2 litres) of water daily. Dehydration slows metabolism and mimics hunger. Start every morning with a full glass of water.' },
  { icon: '😴', title: 'Prioritize Sleep',    text: '7–9 hours of quality sleep is non-negotiable. Poor sleep raises cortisol, increases hunger hormones (ghrelin), and makes fat loss nearly impossible.' },
  { icon: '🧘', title: 'Manage Stress',       text: 'Chronic stress elevates cortisol, promoting belly fat storage. Incorporate 10 minutes of deep breathing, meditation, or a walk in nature daily.' },
  { icon: '🚶', title: 'Move More Daily',     text: 'Beyond workouts, aim for 8,000–10,000 steps/day. Take stairs, walk during calls, park further away — these NEAT activities burn 200–400 extra calories.' },
  { icon: '🍽️', title: 'Eat Mindfully',      text: 'Eat without screens. Chew thoroughly. It takes 20 minutes for your brain to register fullness — slow down to avoid overeating automatically.' },
  { icon: '📅', title: 'Track Your Progress', text: 'Take weekly measurements and photos, not just weight. The scale fluctuates daily. Trends over 4 weeks matter more than daily readings.' },
  { icon: '🩺', title: 'Get Regular Checkups',text: 'Check blood work annually: HbA1c, lipid panel, thyroid, Vitamin D, B12. Many people have silent deficiencies that sabotage energy and body composition.' },
  { icon: '🥗', title: 'Eat Whole Foods',     text: '80% of your diet should be unprocessed: vegetables, fruits, legumes, lean proteins, whole grains, and healthy fats. The other 20% can be flexible.' },
]

const BMI_MEANINGS = {
  'Severely Underweight': 'Your BMI is significantly below the healthy range. This may indicate insufficient caloric intake, malnutrition, or an underlying health condition. It\'s important to consult a doctor to rule out any medical issues and work with a nutritionist to safely gain weight.',
  'Underweight': 'You\'re slightly below the healthy BMI range. This can mean you\'re not consuming enough calories or nutrients for optimal health. Focus on nutrient-dense foods and consider strength training to build muscle mass alongside healthy caloric gains.',
  'Normal Weight': 'Congratulations — you\'re in the healthy BMI range! This is associated with the lowest risk of weight-related health conditions. Focus on maintaining this through a balanced diet and regular physical activity.',
  'Overweight': 'Your BMI is slightly above the healthy range. This increases the risk of conditions like type 2 diabetes, heart disease, and joint problems. A moderate caloric deficit combined with regular exercise can bring your BMI back to the healthy range.',
  'Obese Class I': 'Your BMI indicates obesity class I. This is associated with increased health risks. A structured diet and exercise program can make a significant difference. Consider consulting a healthcare provider for personalized guidance.',
  'Obese Class II': 'Your BMI is in the obese class II range, associated with significantly elevated health risks. Professional medical guidance alongside lifestyle changes is highly recommended.',
  'Obese Class III': 'Your BMI is in the severely obese range. This carries serious health risks. Please consult a healthcare professional as soon as possible to explore safe, medically supervised weight loss options.',
}

const ACT_LABELS = { sedentary: 'Sedentary', light: 'Lightly Active', moderate: 'Moderately Active', active: 'Very Active', extreme: 'Extra Active' }
const GOAL_LABELS = { lose: 'Lose Weight', maintain: 'Maintain', gain: 'Gain Muscle' }

// ── COMPONENTS ────────────────────────────────────────────────────────

function Header() {
  return (
    <header>
      <div className="nav-inner">
        <div className="logo">Know<span>MyBMI</span></div>
        <div className="nav-tagline">Know Your Body. Transform Your Life.</div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <div className="hero">
      <div className="hero-eyebrow">✦ Free · Accurate · No Signup</div>
      <h1>Know Your Body.<br /><em>Transform</em> Your Life.</h1>
      <p>Advanced BMI analysis with personalized diet &amp; exercise plans — built for real results, not generic advice.</p>
      <svg className="hero-wave" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 48L1440 48L1440 12C1200 40 960 4 720 20C480 36 240 8 0 28L0 48Z" fill="#f7f4ef" />
      </svg>
    </div>
  )
}

function Calculator({ onResults }) {
  const [unit, setUnit] = useState('metric')
  const [sex, setSex] = useState('male')
  const [goal, setGoal] = useState('lose')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState('moderate')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function calculate() {
    const ageVal = parseInt(age)
    const h = parseFloat(height)
    const w = parseFloat(weight)

    if (!ageVal || ageVal < 5 || ageVal > 120) { setError('Please enter a valid age (5–120).'); return }
    if (!h || h <= 0) { setError('Please enter your height.'); return }
    if (!w || w <= 0) { setError('Please enter your weight.'); return }

    setError('')
    setLoading(true)

    setTimeout(() => {
      const hCm = unit === 'imperial' ? h * 2.54 : h
      const wKg = unit === 'imperial' ? w * 0.453592 : w
      const bmi = parseFloat((wKg / Math.pow(hCm / 100, 2)).toFixed(1))
      const cat = getBMICat(bmi)
      const bmr = calcBMR(wKg, hCm, ageVal, sex)
      const tdee = calcTDEE(bmr, activity)
      const bf = getBodyFat(bmi, ageVal, sex)
      const adjust = { lose: -500, maintain: 0, gain: 300 }
      const targetCal = tdee + (adjust[goal] || 0)
      const idealMin = parseFloat((18.5 * Math.pow(hCm / 100, 2)).toFixed(1))
      const idealMax = parseFloat((24.9 * Math.pow(hCm / 100, 2)).toFixed(1))
      const idealStr = unit === 'imperial'
        ? `${(idealMin / 0.453592).toFixed(0)}–${(idealMax / 0.453592).toFixed(0)} lbs`
        : `${idealMin}–${idealMax} kg`

      onResults({ bmi, cat, bmr, tdee, bf, targetCal, idealStr, ageVal, hCm, wKg, h, w, unit, sex, activity, goal })
      setLoading(false)
    }, 600)
  }

  return (
    <div className="calc-card" id="calcCard">
      <div className="calc-head">
        <div className="calc-head-icon">⚖️</div>
        <div>
          <h2>Your Body Analysis</h2>
          <p>Fill in your details — takes 30 seconds</p>
        </div>
      </div>
      <div className="calc-body">
        <div className="unit-toggle">
          <button className={`unit-btn${unit === 'metric' ? ' active' : ''}`} onClick={() => setUnit('metric')}>Metric</button>
          <button className={`unit-btn${unit === 'imperial' ? ' active' : ''}`} onClick={() => setUnit('imperial')}>Imperial</button>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Age</label>
            <div className="input-wrap">
              <input className="form-input" type="number" placeholder="25" min="5" max="120" value={age} onChange={e => setAge(e.target.value)} />
              <span className="input-unit">yrs</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Sex</label>
            <div className="btn-group">
              <button className={`choice-btn${sex === 'male' ? ' active' : ''}`} onClick={() => setSex('male')}>♂ Male</button>
              <button className={`choice-btn${sex === 'female' ? ' active' : ''}`} onClick={() => setSex('female')}>♀ Female</button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Height</label>
            <div className="input-wrap">
              <input className="form-input" type="number" placeholder={unit === 'metric' ? '170' : '67'} value={height} onChange={e => setHeight(e.target.value)} />
              <span className="input-unit">{unit === 'metric' ? 'cm' : 'in'}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Weight</label>
            <div className="input-wrap">
              <input className="form-input" type="number" placeholder={unit === 'metric' ? '70' : '154'} value={weight} onChange={e => setWeight(e.target.value)} />
              <span className="input-unit">{unit === 'metric' ? 'kg' : 'lbs'}</span>
            </div>
          </div>

          <div className="form-group full">
            <label className="form-label">Activity Level</label>
            <select className="form-select" value={activity} onChange={e => setActivity(e.target.value)}>
              <option value="sedentary">🛋️  Sedentary — Desk job, little exercise</option>
              <option value="light">🚶  Lightly Active — Light exercise 1–2 days/week</option>
              <option value="moderate">🏃  Moderately Active — Exercise 3–5 days/week</option>
              <option value="active">💪  Very Active — Hard exercise 6–7 days/week</option>
              <option value="extreme">🔥  Extra Active — Athlete / physical job</option>
            </select>
          </div>

          <div className="form-group full">
            <label className="form-label">Primary Goal</label>
            <div className="btn-group">
              <button className={`goal-btn${goal === 'lose' ? ' active' : ''}`} onClick={() => setGoal('lose')}><span className="gi">📉</span>Lose Weight</button>
              <button className={`goal-btn${goal === 'maintain' ? ' active' : ''}`} onClick={() => setGoal('maintain')}><span className="gi">⚖️</span>Maintain</button>
              <button className={`goal-btn${goal === 'gain' ? ' active' : ''}`} onClick={() => setGoal('gain')}><span className="gi">💪</span>Gain Muscle</button>
            </div>
          </div>
        </div>

        <div className="divider" />

        <button className="calc-btn" onClick={calculate} disabled={loading}>
          {loading ? <><div className="spinner" /> Calculating...</> : <><span>⚡</span> Calculate My BMI &amp; Get My Plan</>}
        </button>

        {error && <div className="error-msg">⚠ {error}</div>}
      </div>
    </div>
  )
}

function BMIBanner({ data }) {
  const circ = 2 * Math.PI * 45
  const pct = Math.min(1, Math.max(0, (data.bmi - 10) / 40))
  const markerPct = Math.min(100, Math.max(0, (data.bmi - 10) / 40 * 100))

  return (
    <div className="bmi-banner">
      <div className="bmi-banner-left">
        <h3>Your Body Mass Index</h3>
        <div className="bmi-number">{data.bmi}</div>
        <div className="bmi-cat-badge" style={{ borderColor: data.cat.color + '55' }}>
          {data.cat.emoji} {data.cat.label}
        </div>
        <div className="bmi-scale" style={{ maxWidth: '340px', marginTop: '20px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>BMI Scale</div>
          <div className="bmi-scale-track">
            <div className="bmi-scale-marker" style={{ left: markerPct + '%' }} />
          </div>
          <div className="bmi-scale-labels">
            <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
          </div>
        </div>
      </div>
      <div className="bmi-banner-right">
        <div className="bmi-gauge-wrap">
          <svg className="gauge-svg" width="140" height="140" viewBox="0 0 100 100">
            <circle className="gauge-bg" cx="50" cy="50" r="45" />
            <circle className="gauge-fill" cx="50" cy="50" r="45"
              style={{ strokeDasharray: circ, strokeDashoffset: circ * (1 - pct), stroke: data.cat.color }} />
          </svg>
          <div className="gauge-center">
            <div className="gc-val">{data.bmi}</div>
            <div className="gc-label">BMI</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsGrid({ data }) {
  const goalLabels = { lose: 'For weight loss (−500 kcal)', maintain: 'For maintenance', gain: 'For muscle gain (+300 kcal)' }
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-icon">🔥</div>
        <div className="stat-card-label">Daily Calories</div>
        <div className="stat-card-value">{data.targetCal.toLocaleString()} kcal</div>
        <div className="stat-card-sub">{goalLabels[data.goal]}</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-icon">⚙️</div>
        <div className="stat-card-label">BMR</div>
        <div className="stat-card-value">{data.bmr.toLocaleString()} kcal</div>
        <div className="stat-card-sub">Calories at rest</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-icon">🎯</div>
        <div className="stat-card-label">Ideal Weight</div>
        <div className="stat-card-value">{data.idealStr}</div>
        <div className="stat-card-sub">Healthy BMI range</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-icon">📊</div>
        <div className="stat-card-label">Est. Body Fat</div>
        <div className="stat-card-value">{data.bf}%</div>
        <div className="stat-card-sub">Estimation (Navy method)</div>
      </div>
    </div>
  )
}

function OverviewTab({ data }) {
  const protein = data.goal === 'gain' ? Math.round(data.wKg * 2.2) : data.goal === 'lose' ? Math.round(data.wKg * 2.0) : Math.round(data.wKg * 1.8)
  return (
    <div>
      <div className="overview-grid">
        <div>
          <div className="info-block">
            <h4>Your Metrics</h4>
            {[
              ['Age', data.ageVal + ' years'],
              ['Height', data.unit === 'imperial' ? data.h + ' in (' + data.hCm.toFixed(0) + ' cm)' : data.hCm.toFixed(0) + ' cm'],
              ['Weight', data.unit === 'imperial' ? data.w + ' lbs (' + data.wKg.toFixed(1) + ' kg)' : data.wKg.toFixed(1) + ' kg'],
              ['Sex', data.sex.charAt(0).toUpperCase() + data.sex.slice(1)],
              ['Activity', ACT_LABELS[data.activity]],
              ['Goal', GOAL_LABELS[data.goal]],
            ].map(([label, val]) => (
              <div className="info-row" key={label}>
                <span className="info-row-label">{label}</span>
                <span className="info-row-val">{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="info-block">
            <h4>BMI Classification</h4>
            {[
              ['Your BMI', data.bmi],
              ['Category', data.cat.label],
              ['BMR', data.bmr.toLocaleString() + ' kcal/day'],
              ['Maintenance Cal.', data.tdee.toLocaleString() + ' kcal/day'],
              ['Target Cal.', data.targetCal.toLocaleString() + ' kcal/day'],
              ['Protein Target', protein + 'g/day'],
            ].map(([label, val]) => (
              <div className="info-row" key={label}>
                <span className="info-row-label">{label}</span>
                <span className="info-row-val">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="info-block" style={{ marginTop: '16px' }}>
        <h4>What Your BMI Means</h4>
        <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.7', marginTop: '8px' }}>
          {BMI_MEANINGS[data.cat.label]}
        </p>
      </div>
    </div>
  )
}

function DietTab({ data }) {
  const { plan, protein, carbs, fat } = getDietData(data.goal, data.targetCal, data.wKg)
  const maxMacro = Math.max(protein, carbs, fat)

  return (
    <div>
      <div className="diet-intro">
        <div className="diet-intro-icon">🥗</div>
        <div>
          <h4>{plan.title}</h4>
          <p>{plan.desc}</p>
        </div>
      </div>

      <div className="macros-bar">
        <h4>Daily Macronutrient Targets</h4>
        {[
          { label: '🥩 Protein', cls: 'protein', val: protein, unit: 'g' },
          { label: '🍚 Carbs',   cls: 'carbs',   val: carbs,   unit: 'g' },
          { label: '🥑 Fats',    cls: 'fat',     val: fat,     unit: 'g' },
        ].map(m => (
          <div className="macro-row" key={m.cls}>
            <span className="macro-name">{m.label}</span>
            <div className="macro-track">
              <div className={`macro-fill ${m.cls}`} style={{ width: (m.val / maxMacro * 100) + '%' }} />
            </div>
            <span className="macro-val">{m.val}{m.unit}</span>
          </div>
        ))}
      </div>

      <div className="meal-plan">
        {plan.meals.map((m, i) => (
          <div className="meal-card" key={i}>
            <div className="meal-card-head">
              <span>{m.name}</span>
              <span className="meal-cal">{m.cal}</span>
            </div>
            <div className="meal-card-body">
              <ul className="meal-items">
                {m.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="tips-grid">
        {plan.tips.map((t, i) => {
          const parts = t.split(' ')
          const icon = parts[0]
          const text = parts.slice(1).join(' ')
          return (
            <div className="tip-card" key={i}>
              <div className="tip-icon">{icon}</div>
              <div className="tip-text">{text}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ExerciseTab({ data }) {
  const exData = getExerciseData(data.goal)
  return (
    <div>
      <div className="week-grid">
        {exData.week.map((d, i) => (
          <div key={i} className={`day-pill${!d.active ? ' rest' : ' active-day'}`}>
            <div className="day-name">{d.day}</div>
            <div className="day-icon">{d.icon}</div>
            <div className="day-type">{d.type}</div>
          </div>
        ))}
      </div>
      <div className="exercise-blocks">
        {exData.blocks.map((b, i) => (
          <div className="ex-block" key={i}>
            <div className="ex-block-head">
              <span>{b.name}</span>
              <span className="ex-tag">{b.tag}</span>
            </div>
            <table className="ex-table">
              <thead>
                <tr>
                  <th>Exercise</th><th>Sets</th><th>Reps / Duration</th><th>Rest</th>
                </tr>
              </thead>
              <tbody>
                {b.exercises.map((e, j) => (
                  <tr key={j}>
                    <td>{e.name}</td>
                    <td><span className="set-badge">{e.sets}</span></td>
                    <td>{e.reps}</td>
                    <td>{e.rest}</td>
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
    <div className="htips-grid">
      {HEALTH_TIPS.map((t, i) => (
        <div className="htip-card" key={i}>
          <div className="htip-icon">{t.icon}</div>
          <h4>{t.title}</h4>
          <p>{t.text}</p>
        </div>
      ))}
    </div>
  )
}

function Results({ data }) {
  const [activeTab, setActiveTab] = useState('overview')
  const ref = useRef(null)

  useEffect(() => {
    setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }, [data])

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'diet',     label: '🥗 Diet Plan' },
    { id: 'exercise', label: '🏋️ Exercise Plan' },
    { id: 'tips',     label: '💡 Health Tips' },
  ]

  return (
    <div className="results-wrap" ref={ref}>
      <BMIBanner data={data} />
      <StatsGrid data={data} />

      <div className="tabs-wrap">
        <div className="tabs-nav">
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className={`tab-panel${activeTab === 'overview' ? ' active' : ''}`} id="tab-overview">
          <OverviewTab data={data} />
        </div>
        <div className={`tab-panel${activeTab === 'diet' ? ' active' : ''}`} id="tab-diet">
          <DietTab data={data} />
        </div>
        <div className={`tab-panel${activeTab === 'exercise' ? ' active' : ''}`} id="tab-exercise">
          <ExerciseTab data={data} />
        </div>
        <div className={`tab-panel${activeTab === 'tips' ? ' active' : ''}`} id="tab-tips">
          <HealthTipsTab />
        </div>
      </div>

      <div className="print-row">
        <button className="btn-outline" onClick={() => window.print()}>🖨️ Print / Save PDF</button>
        <button className="btn-outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Recalculate</button>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer>
      <strong>KnowMyBMI</strong> · Advanced Body Composition Analysis<br />
      <div className="footer-links">
        <span>© 2025 knowmybmi.com</span>
        <a href="#">Privacy</a>
        <a href="#">Disclaimer</a>
        <a href="#">Contact</a>
      </div>
      <div style={{ marginTop: '12px', fontSize: '11px', maxWidth: '500px', margin: '12px auto 0' }}>
        Disclaimer: This tool provides general wellness information and is not a substitute for medical advice. Consult a healthcare professional before making significant dietary or exercise changes.
      </div>
    </footer>
  )
}

function ScrollTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!show) return null
  return (
    <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
  )
}

// ── APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [results, setResults] = useState(null)

  return (
    <>
      <Header />
      <Hero />
      <main>
        <Calculator onResults={setResults} />
        {results && <Results data={results} />}
      </main>
      <Footer />
      <ScrollTop />
    </>
  )
}
