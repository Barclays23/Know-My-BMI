import { useEffect, useState } from "react"


export function ScrollTopButton() {
  const [show, setShow] = useState(false)

  useEffect(()=>{
    const fn=()=>setShow(window.scrollY>300)
    window.addEventListener('scroll',fn)
    return ()=>window.removeEventListener('scroll',fn)
  },[])

  if(!show) return null

  return (
    <button 
      onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
      className="scroll-top-btn fixed bottom-6 right-6 w-11 h-11 bg-green text-white border-none rounded-full text-lg flex items-center justify-center shadow-card-lg z-50 cursor-pointer transition-all hover:bg-green-mid hover:-translate-y-0.5">
      ↑
    </button>
  )
}