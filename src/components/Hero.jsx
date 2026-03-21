
import appleImg from '../assets/images/green-apple1.png'


export default function Hero () {
  return (
    <div className="hero-glow bg-green relative overflow-hidden min-h-105 flex items-center px-[5%] pt-20 pb-24">

      {/* Apple ring */}
      <div
        className="apple-ring absolute top-1/2 -translate-y-1/2 -right-10 rounded-full border border-green-accent/8 z-1 pointer-events-none animate-apple-drift"
        style={{ width:'clamp(330px,40vw,540px)', height:'clamp(330px,40vw,540px)' }}
      />

      {/* Apple image */}
      <img
        src={appleImg}
        alt=""
        draggable="false"
        className="absolute top-1/2 -translate-y-1/2 -right-10 object-contain 
          opacity-[0.83] blur-[0.5px] saturate-150 brightness-110 z-2 
          pointer-events-none select-none animate-apple-drift max-sm:opacity-[0.57]"
        style={{ width:'clamp(320px,38vw,520px)', height:'clamp(320px,38vw,520px)' }}
      />

      {/* Content */}
      <div className="relative z-3 max-w-200">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-green-accent border border-green-accent/25 
          rounded-full px-3.5 py-1.25 mb-6 backdrop-blur-sm bg-green-accent/5">
          ✦ Free · Accurate · No Signup
        </div>

        <h1 className="font-display font-bold text-white leading-[1.05] tracking-[-1.5px] mb-5" style={{fontSize:'clamp(40px,6vw,76px)'}}>
          Know Your Body.<br /><em className="italic text-green-accent">Transform</em> Your Life.
        </h1>

        <p className="text-white/60 font-light leading-[1.7] mb-8 max-w-120" style={{fontSize:'clamp(15px,1.8vw,17px)'}}>
          Advanced BMI analysis with personalized diet &amp; exercise plans — built for real results, not generic advice.
        </p>

        <div className="flex flex-wrap gap-2.5">
          {[['⚡','Instant Results'],['🎯','Personalized Plans'],['🔒','No Account Needed'],['🥗','Diet + Exercise']].map(([icon,label])=>(
            <div key={label} className="flex items-center gap-1.75 text-xs font-medium text-white/75 bg-white/6 border border-white/10 rounded-full px-3.5 py-2 backdrop-blur-sm">
              <span className="text-sm">{icon}</span> {label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <svg className="absolute -bottom-px left-0 right-0 z-3" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 48L1440 48L1440 12C1200 40 960 4 720 20C480 36 240 8 0 28L0 48Z" fill="#ffffff"/>
      </svg>
    </div>
  )
}
