import { getDietData } from '../utils/utils';


export default function DietTab({ data }) {
   const {plan,protein,carbs,fat}=getDietData(data.goal,data.targetCal,data.wKg)
   const maxMacro=Math.max(protein,carbs,fat)

   
   return (
      <div>
         <div className="bg-green-light rounded-2xl p-5 mb-6 flex gap-3.5 items-start">
            <div className="text-[28px] shrink-0">🥗</div>
            <div><h4 className="text-[15px] font-semibold text-green mb-1">{plan.title}</h4><p className="text-[13px] text-[#1e2d1e] leading-[1.6]">{plan.desc}</p></div>
         </div>

         <div className="bg-bg rounded-2xl p-5 mb-6">
            <h4 className="text-[13px] font-semibold text-green uppercase tracking-widest mb-4">Daily Macronutrient Targets</h4>
            {[{label:'🥩 Protein',cls:'bg-green',val:protein},{label:'🍚 Carbs',cls:'bg-gold',val:carbs},{label:'🥑 Fats',cls:'bg-green-accent brightness-75',val:fat}].map((m,i)=>(
               <div key={i} className="flex items-center gap-3 mb-2.5">
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
                  <div className="px-4.5 py-3.5 bg-green flex items-center justify-between">
                     <span className="text-sm font-semibold text-white">{m.name}</span>
                     <span className="text-xs text-white/60">{m.cal}</span>
                  </div>
                  <div className="px-4.5 py-4">
                     <ul className="list-none">
                        {m.items.map((item, j)=>(
                           <li key={j} className="text-sm text-[#1e2d1e] py-1.5 border-b border-border last:border-b-0 flex items-baseline gap-2">
                              <span className="text-green text-base shrink-0">•</span>{item}
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
                     <div className="text-xl shrink-0">{icon}</div>
                     <div className="text-[13px] text-[#1e2d1e] leading-normal">{text}</div>
                  </div>
               )
            })}
         </div>
      </div>
   )
}