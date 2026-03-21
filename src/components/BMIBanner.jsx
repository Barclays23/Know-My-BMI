

export default function BMIBanner({ data }) {
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
      <div className="bg-linear-to-br from-green to-green-700 rounded-card p-10 mb-6 text-white grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 items-center">
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
               className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mt-3"
               style={{ borderColor: data.cat.color + '55', backgroundColor: data.cat.color }}
            >
               {data.cat.emoji} {data.cat.label}
            </div>

            <div className="mt-6 max-w-120">
               <div className="text-[11px] text-white/50 mb-2 tracking-widest uppercase">
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
                     className="absolute -top-1.25 w-4 h-4 rounded-full bg-white border-4 border-green-600 -translate-x-1/2 transition-all duration-1000 shadow-lg z-10"
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
                  <div className="text-[10px] text-white/50 uppercase tracking-widest">
                     BMI
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}