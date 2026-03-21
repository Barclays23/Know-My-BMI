import { ACT_LABELS, BMI_MEANINGS, GOAL_LABELS } from '../constants/constants';


export default function OverviewTab({ data }) {
   const protein=data.goal==='gain'?Math.round(data.wKg*2.2):data.goal==='lose'?Math.round(data.wKg*2.0):Math.round(data.wKg*1.8)
   const blockCls="bg-bg rounded-2xl p-5"
   const rowCls="flex justify-between items-center py-2 border-b border-border text-sm last:border-b-0"


   return (
      <div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className={blockCls}>
               <h4 className="text-[13px] font-semibold text-green uppercase tracking-widest mb-3">Your Metrics</h4>
               {[['Age',data.ageVal+' years'],['Height',data.unit==='imperial'?data.h+' in ('+data.hCm.toFixed(0)+' cm)':data.hCm.toFixed(0)+' cm'],['Weight',data.unit==='imperial'?data.w+' lbs ('+data.wKg.toFixed(1)+' kg)':data.wKg.toFixed(1)+' kg'],['Sex',data.sex.charAt(0).toUpperCase()+data.sex.slice(1)],['Activity',ACT_LABELS[data.activity]],['Goal',GOAL_LABELS[data.goal]]].map(([l,v])=>(
                  <div className={rowCls} key={l}><span className="text-muted">{l}</span><span className="font-semibold text-[#1e2d1e]">{v}</span></div>
               ))}
            </div>
            <div className={blockCls}>
               <h4 className="text-[13px] font-semibold text-green uppercase tracking-widest mb-3">BMI Classification</h4>
               {[['Your BMI',data.bmi],['Category',data.cat.label],['BMR',data.bmr.toLocaleString()+' kcal/day'],['Maintenance Cal.',data.tdee.toLocaleString()+' kcal/day'],['Target Cal.',data.targetCal.toLocaleString()+' kcal/day'],['Protein Target',protein+'g/day']].map(([l,v])=>(
                  <div className={rowCls} key={l}><span className="text-muted">{l}</span><span className="font-semibold text-[#1e2d1e]">{v}</span></div>
               ))}
            </div>
            </div>
               <div className="bg-bg rounded-2xl p-5 mt-4">
               <h4 className="text-[13px] font-semibold text-green uppercase tracking-widest mb-2">What Your BMI Means</h4>
               <p className="text-sm text-[#1e2d1e] leading-[1.7]">{BMI_MEANINGS[data.cat.label]}</p>
            </div>
      </div>
   )
}