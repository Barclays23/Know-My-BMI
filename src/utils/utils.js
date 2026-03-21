// ── HELPERS ──────────────────────────────────────────────────────────

export function getBMICat(bmi) {
  if (bmi < 16) {
    return { label: 'Severely Underweight', color: '#60a5fa', emoji: '⚠️' };   // Blue-400 – concern
  }
  if (bmi < 18.5) {
    return { label: 'Underweight', color: '#93c5fd', emoji: '📉' };           // Lighter blue
  }
  if (bmi < 25) {
    return { label: 'Normal Weight', color: '#4ade80', emoji: '✅' };         // Green-400 – healthy
  }
  if (bmi < 30) {
    return { label: 'Overweight', color: '#fbbf24', emoji: '📊' };            // Amber-400 – caution
  }
  if (bmi < 35) {
    return { label: 'Obese Class I', color: '#f59e0b', emoji: '⚠️' };         // Deeper amber/orange
  }
  if (bmi < 40) {
    return { label: 'Obese Class II', color: '#ef4444', emoji: '⚠️' };        // Red-500
  }
  return { label: 'Obese Class III', color: '#dc2626', emoji: '🚨' };         // Darker red – severe
}



export function calcBMR(wKg,hCm,age,sex){
  return sex==='male'
    ? Math.round(10*wKg+6.25*hCm-5*age+5)
    : Math.round(10*wKg+6.25*hCm-5*age-161)
}



export function calcTDEE(bmr,act){
  const m={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,extreme:1.9}
  return Math.round(bmr*(m[act]||1.55))
}




export function getBodyFat(bmi,age,sex){
  const bf=sex==='male' ? 1.20*bmi+0.23*age-16.2 : 1.20*bmi+0.23*age-5.4
  return Math.max(5,Math.round(bf))
}




export function getDietData(goal,targetCal,wKg){
  const protein=goal==='gain'?Math.round(wKg*2.2):goal==='lose'?Math.round(wKg*2.0):Math.round(wKg*1.8)
  const fat=Math.round(targetCal*0.25/9)
  const carbs=Math.round((targetCal-protein*4-fat*9)/4)
  const plans={
    lose:{
      title:'Weight Loss Diet Plan',
      desc:`Your target is ${targetCal} kcal/day with high protein to preserve muscle while burning fat.`,
      meals:[
        {name:'🌅 Breakfast',cal:'350–400 kcal',items:['2 whole eggs + 2 egg whites scrambled','1 slice whole grain toast','½ cup oats or 1 banana','Black coffee or green tea (no sugar)']},
        {name:'🍎 Morning Snack',cal:'150–200 kcal',items:['1 apple or pear','10 almonds or walnuts','1 cup green tea']},
        {name:'☀️ Lunch',cal:'400–450 kcal',items:['150g grilled chicken breast or 200g fish','Large salad (lettuce, cucumber, tomato)','1 tbsp olive oil + lemon dressing','½ cup brown rice or 1 roti']},
        {name:'🥤 Evening Snack',cal:'150–200 kcal',items:['1 cup low-fat yogurt / curd','½ cup berries or papaya','Handful of pumpkin seeds']},
        {name:'🌙 Dinner',cal:'350–400 kcal',items:['150g grilled fish / tofu / paneer','Steamed vegetables (broccoli, beans, carrots)','Small bowl dal or lentil soup','Avoid rice after 7 PM']},
      ],
      tips:['💧 Drink 3–4 litres of water daily','🌙 Stop eating 2–3 hours before bedtime','🥦 Fill half your plate with vegetables','⏰ Try intermittent fasting: eat in 8-hour window','🧂 Reduce sodium — it causes water retention','🍳 Cook with olive oil instead of refined oils','🚫 Avoid liquid calories: sodas, juices, alcohol'],
    },
    maintain:{
      title:'Balanced Maintenance Diet Plan',
      desc:`Your target is ${targetCal} kcal/day. Focus on balanced macros and nutrient-dense foods.`,
      meals:[
        {name:'🌅 Breakfast',cal:'400–450 kcal',items:['2 whole eggs any style','1 cup oatmeal with berries','1 slice whole grain toast with nut butter','1 glass low-fat milk']},
        {name:'🍎 Morning Snack',cal:'200–250 kcal',items:['1 handful mixed nuts and dried fruit','1 piece of fruit']},
        {name:'☀️ Lunch',cal:'500–550 kcal',items:['150g lean protein (chicken, fish, legumes)','1 cup cooked grains (quinoa, brown rice)','Generous portion of vegetables','Olive oil drizzle + herbs']},
        {name:'🥤 Evening Snack',cal:'200 kcal',items:['Greek yogurt with honey','Carrot and cucumber sticks with hummus']},
        {name:'🌙 Dinner',cal:'450–500 kcal',items:['150g protein of choice','1 medium sweet potato or 2 rotis','Stir-fried or steamed vegetables','1 small bowl of soup or salad']},
      ],
      tips:['⚖️ Weigh yourself weekly to track progress','🎨 Eat a rainbow of coloured fruits and veggies','🍽️ Practice mindful eating: chew slowly','🫙 Meal prep on Sundays to avoid unhealthy choices','☕ Limit caffeine after 2 PM'],
    },
    gain:{
      title:'Muscle Gain Diet Plan',
      desc:`Your target is ${targetCal} kcal/day with high protein to fuel muscle growth.`,
      meals:[
        {name:'🌅 Breakfast',cal:'550–600 kcal',items:['3 whole eggs + 1 cup oatmeal','1 banana + 1 tbsp peanut butter','1 glass full-fat milk','Optional: protein shake']},
        {name:'🏋️ Pre-Workout',cal:'300–350 kcal',items:['1 banana or dates (fast carbs)','20g whey protein or 2 boiled eggs','Black coffee for performance boost']},
        {name:'☀️ Lunch',cal:'600–650 kcal',items:['200g grilled chicken, beef or fish','1.5 cups brown rice or pasta','Mixed vegetables with olive oil','1 cup legumes (lentils, chickpeas)']},
        {name:'💪 Post-Workout',cal:'250–300 kcal',items:['25g whey protein shake','1 banana or slice of bread','Electrolyte water']},
        {name:'🌙 Dinner',cal:'550–600 kcal',items:['200g lean protein (eggs, fish, chicken)','Sweet potato or 2 rotis','Steamed broccoli, spinach, peas','Full-fat yogurt before bed']},
      ],
      tips:['🏋️ Eat within 30 minutes post-workout','😴 Sleep 8+ hours — muscle grows during sleep','📅 Eat every 3–4 hours to keep amino acids flowing','🥛 Casein protein before bed feeds muscles overnight','💊 Consider creatine monohydrate (3–5g/day)'],
    },
  }
  return {plan:plans[goal],protein,carbs,fat}
}




export function getExerciseData(goal){
  const schedules={
    lose:{
      week:[{day:'Mon',type:'Cardio',icon:'🏃',active:true},{day:'Tue',type:'Strength',icon:'🏋️',active:true},{day:'Wed',type:'Cardio',icon:'🚴',active:true},{day:'Thu',type:'Strength',icon:'💪',active:true},{day:'Fri',type:'HIIT',icon:'⚡',active:true},{day:'Sat',type:'Walk',icon:'🚶',active:true},{day:'Sun',type:'Rest',icon:'😴',active:false}],
      blocks:[
        {name:'Monday — Cardio',tag:'45–60 min',exercises:[{name:'Brisk Walking / Jogging',sets:'1',reps:'45 min steady pace',rest:'—'},{name:'Jump Rope',sets:'5',reps:'1 min on / 30 sec off',rest:'30 sec'},{name:'Cycling',sets:'1',reps:'20 min moderate',rest:'—'}]},
        {name:'Tuesday — Full Body Strength',tag:'40–50 min',exercises:[{name:'Squats (bodyweight or goblet)',sets:'4',reps:'15 reps',rest:'60 sec'},{name:'Push-ups',sets:'4',reps:'12–15 reps',rest:'60 sec'},{name:'Dumbbell Rows',sets:'3',reps:'12 reps each side',rest:'60 sec'},{name:'Lunges',sets:'3',reps:'12 each leg',rest:'60 sec'},{name:'Plank',sets:'3',reps:'45 sec hold',rest:'30 sec'}]},
        {name:'Wednesday — Low Impact Cardio',tag:'30–45 min',exercises:[{name:'Swimming or Cycling',sets:'1',reps:'30 min moderate',rest:'—'},{name:'Yoga Flow / Stretching',sets:'1',reps:'15 min',rest:'—'}]},
        {name:'Thursday — Strength & Core',tag:'45 min',exercises:[{name:'Deadlifts (light)',sets:'4',reps:'12 reps',rest:'90 sec'},{name:'Shoulder Press',sets:'3',reps:'12 reps',rest:'60 sec'},{name:'Bicycle Crunches',sets:'3',reps:'20 reps',rest:'45 sec'},{name:'Leg Press or Step-Ups',sets:'3',reps:'15 reps',rest:'60 sec'},{name:'Russian Twists',sets:'3',reps:'20 reps',rest:'45 sec'}]},
        {name:'Friday — HIIT Blast',tag:'25–30 min',exercises:[{name:'Burpees',sets:'4',reps:'10 reps',rest:'30 sec'},{name:'Jump Squats',sets:'4',reps:'15 reps',rest:'30 sec'},{name:'Mountain Climbers',sets:'4',reps:'30 sec',rest:'20 sec'},{name:'High Knees',sets:'4',reps:'30 sec',rest:'20 sec'},{name:'Box Jumps or Squat Jumps',sets:'3',reps:'10 reps',rest:'45 sec'}]},
      ],
    },
    maintain:{
      week:[{day:'Mon',type:'Strength',icon:'🏋️',active:true},{day:'Tue',type:'Cardio',icon:'🏃',active:true},{day:'Wed',type:'Active Rest',icon:'🧘',active:true},{day:'Thu',type:'Strength',icon:'💪',active:true},{day:'Fri',type:'Cardio',icon:'🚴',active:true},{day:'Sat',type:'Sport/Fun',icon:'⚽',active:true},{day:'Sun',type:'Rest',icon:'😴',active:false}],
      blocks:[
        {name:'Monday & Thursday — Full Body Strength',tag:'45–55 min',exercises:[{name:'Barbell / Goblet Squat',sets:'4',reps:'10–12 reps',rest:'90 sec'},{name:'Bench Press or Push-ups',sets:'4',reps:'10–12 reps',rest:'90 sec'},{name:'Bent-Over Rows',sets:'3',reps:'10 reps',rest:'75 sec'},{name:'Overhead Press',sets:'3',reps:'10 reps',rest:'75 sec'},{name:'Romanian Deadlift',sets:'3',reps:'10 reps',rest:'90 sec'},{name:'Plank or Ab Wheel',sets:'3',reps:'45 sec',rest:'30 sec'}]},
        {name:'Tuesday & Friday — Cardio',tag:'30–40 min',exercises:[{name:'Running or Cycling',sets:'1',reps:'30 min at 60–70% max HR',rest:'—'},{name:'Cool-down Walk',sets:'1',reps:'5–10 min',rest:'—'}]},
        {name:'Wednesday — Active Recovery',tag:'30 min',exercises:[{name:'Yoga or Mobility Work',sets:'1',reps:'20 min',rest:'—'},{name:'Foam Rolling',sets:'1',reps:'10 min full body',rest:'—'}]},
      ],
    },
    gain:{
      week:[{day:'Mon',type:'Push',icon:'🏋️',active:true},{day:'Tue',type:'Pull',icon:'💪',active:true},{day:'Wed',type:'Legs',icon:'🦵',active:true},{day:'Thu',type:'Rest',icon:'😴',active:false},{day:'Fri',type:'Push',icon:'🏋️',active:true},{day:'Sat',type:'Pull+Legs',icon:'💥',active:true},{day:'Sun',type:'Rest',icon:'😴',active:false}],
      blocks:[
        {name:'Monday & Friday — Push (Chest, Shoulders, Triceps)',tag:'60 min',exercises:[{name:'Barbell Bench Press',sets:'4',reps:'8–10 reps',rest:'90 sec'},{name:'Incline Dumbbell Press',sets:'3',reps:'10–12 reps',rest:'75 sec'},{name:'Overhead Shoulder Press',sets:'4',reps:'8–10 reps',rest:'90 sec'},{name:'Lateral Raises',sets:'3',reps:'12–15 reps',rest:'60 sec'},{name:'Tricep Dips or Pushdowns',sets:'3',reps:'12 reps',rest:'60 sec'}]},
        {name:'Tuesday — Pull (Back, Biceps)',tag:'60 min',exercises:[{name:'Pull-ups or Lat Pulldown',sets:'4',reps:'6–10 reps',rest:'90 sec'},{name:'Barbell Rows',sets:'4',reps:'8–10 reps',rest:'90 sec'},{name:'Seated Cable Row',sets:'3',reps:'10–12 reps',rest:'75 sec'},{name:'Face Pulls',sets:'3',reps:'15 reps',rest:'60 sec'},{name:'Barbell or Dumbbell Curls',sets:'3',reps:'10–12 reps',rest:'60 sec'}]},
        {name:'Wednesday — Legs',tag:'60 min',exercises:[{name:'Barbell Squat',sets:'4',reps:'6–8 reps (heavy)',rest:'2 min'},{name:'Romanian Deadlift',sets:'4',reps:'8–10 reps',rest:'90 sec'},{name:'Leg Press',sets:'3',reps:'12–15 reps',rest:'75 sec'},{name:'Walking Lunges',sets:'3',reps:'12 each leg',rest:'75 sec'},{name:'Calf Raises',sets:'4',reps:'15–20 reps',rest:'45 sec'}]},
        {name:'Saturday — Push + Pull Combined',tag:'75 min',exercises:[{name:'Deadlift',sets:'5',reps:'5 reps (max strength)',rest:'2–3 min'},{name:'Dumbbell Bench Press',sets:'3',reps:'10–12 reps',rest:'75 sec'},{name:'Pull-ups',sets:'3',reps:'Max reps',rest:'90 sec'},{name:'Arnold Press',sets:'3',reps:'10 reps',rest:'75 sec'},{name:'Hammer Curls + Tricep Extensions',sets:'3',reps:'12 reps each',rest:'60 sec'}]},
      ],
    },
  }
  return schedules[goal]
}
