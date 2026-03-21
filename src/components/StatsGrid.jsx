

export default function StatsGrid({ data }) {
   const goalLabels = {
     lose: "For weight loss (−500 kcal)",
     maintain: "For maintenance",
     gain: "For muscle gain (+300 kcal)",
   };

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
               <div className="text-[22px] mb-2.5">{c.icon}</div>
               <div className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-1">{c.label}</div>
               <div className="font-display text-[28px] font-bold text-[#1e2d1e] leading-[1.1]">{c.val}</div>
               <div className="text-xs text-muted mt-0.5">{c.sub}</div>
            </div>
         ))}
      </div>
   )
}