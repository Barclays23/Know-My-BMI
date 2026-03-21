import { getExerciseData } from "../utils/utils"




export default function ExerciseTab({ data }) {
   const exData = getExerciseData(data.goal)

   return (
      <div>
         <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-6">
            {exData.week.map((d,i)=>(
               <div key={i} className={`border-[1.5px] rounded-xl px-2 py-2.5 text-center ${d.active?'border-green bg-green-light':'border-border bg-bg opacity-50'}`}>
                  <div className="text-[11px] font-semibold text-muted tracking-[0.05em]">{d.day}</div>
                  <div className="text-lg mt-1">{d.icon}</div>
                  <div className="text-[11px] font-medium text-[#1e2d1e] mt-0.5">{d.type}</div>
               </div>
            ))}
         </div>
         <div className="grid gap-4">
            {exData.blocks.map((b,i)=>(
               <div key={i} className="bg-bg rounded-2xl overflow-hidden border border-border">
                  <div className="px-4.5 py-3.5 bg-linear-to-r from-green to-green-700 flex items-center justify-between">
                     <span className="text-sm font-semibold text-white">{b.name}</span>
                     <span className="text-[11px] font-medium bg-white/15 text-white rounded-full px-2.5 py-0.75">{b.tag}</span>
                  </div>
                  <table className="w-full border-collapse">
                     <thead>
                        <tr>
                           {['Exercise','Sets','Reps / Duration','Rest'].map(h=>(
                           <th key={h} className="text-left px-4.5 py-2.5 text-[11px] font-semibold tracking-widest uppercase text-muted border-b border-border bg-surface">{h}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        {b.exercises.map((e,j)=>(
                           <tr key={j} className="border-b border-border last:border-b-0 hover:bg-green/7">
                              <td className="px-4.5 py-2.75 text-[13px]">{e.name}</td>
                              <td className="px-4.5 py-2.75 text-[13px]"><span className="inline-block text-xs font-semibold text-green bg-green-light rounded-md px-2 py-0.5">{e.sets}</span></td>
                              <td className="px-4.5 py-2.75 text-[13px]">{e.reps}</td>
                              <td className="px-4.5 py-2.75 text-[13px]">{e.rest}</td>
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