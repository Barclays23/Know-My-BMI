import { HEALTH_TIPS } from "../constants/constants";



export default function HealthTipsTab() {

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         {HEALTH_TIPS.map((t,i)=>(
         <div key={i} className="bg-bg rounded-2xl p-5 border border-border transition-all hover:-translate-y-0.5 hover:shadow-card">
            <div className="text-[28px] mb-2.5">{t.icon}</div>
            <h4 className="text-[15px] font-semibold text-green mb-1.5">{t.title}</h4>
            <p className="text-[13px] text-[#1e2d1e] leading-[1.6]">{t.text}</p>
         </div>
         ))}
      </div>
   )
}