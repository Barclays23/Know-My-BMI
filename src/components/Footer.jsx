export function Footer() {
  return (
    <footer className="bg-green text-white/60 text-center px-[5%] py-8 text-[13px]">
      <strong className="text-green-accent">KnowMyBMI</strong> · Advanced Body Composition Analysis
      <div className="flex justify-center gap-5 mt-2 flex-wrap">
        <span>© 2025 knowmybmi.com</span>
        <a href="#" className="text-white/50 hover:text-green-accent transition-colors">Privacy</a>
        <a href="#" className="text-white/50 hover:text-green-accent transition-colors">Disclaimer</a>
        <a href="#" className="text-white/50 hover:text-green-accent transition-colors">Contact</a>
      </div>
      <div className="text-[11px] max-w-125 mx-auto mt-3 opacity-60">
        Disclaimer: This tool provides general wellness information and is not a substitute for medical advice.
      </div>
    </footer>
  )
}