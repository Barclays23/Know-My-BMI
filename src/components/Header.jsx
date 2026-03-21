
export default function Header() {
   return (
      <header className="bg-green sticky top-0 z-100 px-[5%]">
         <div className="max-w-content mx-auto flex items-center justify-between h-16">
            <div className="font-display text-2xl font-bold text-white tracking-[-0.5px]">
               Know<span className="text-green-accent">MyBMI</span>
            </div>
            <div className="text-xs text-white/50 font-light tracking-[0.06em] hidden sm:block">
               Know Your Body. Transform Your Life.
            </div>
         </div>
      </header>
   )
}