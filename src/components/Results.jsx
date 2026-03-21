import { useEffect, useRef, useState } from "react";
import OverviewTab from "./OverviewTab";
import DietTab from "./DietTab";
import ExerciseTab from "./ExerciseTab";
import HealthTipsTab from "./HealthTipsTab";
import BMIBanner from "./BMIBanner";
import StatsGrid from "./StatsGrid";




export default function Results({ data, calculatorRef }) {
   const [activeTab, setActiveTab] = useState("overview");
   const ref = useRef(null);


   useEffect(() => {
      setTimeout(
         () => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
         100,
      );
   }, [data]);


   const tabs = [
      { id: "overview", label: "📊 Overview" },
      { id: "diet", label: "🥗 Diet Plan" },
      { id: "exercise", label: "🏋️ Exercise Plan" },
      { id: "tips", label: "💡 Health Tips" },
   ];

   return (
      <div className="results-wrap animate-fade-up" ref={ref}>
         <BMIBanner data={data} />
         <StatsGrid data={data} />
         <div className="bg-surface rounded-card border border-border shadow-card overflow-hidden">
            <div className="tabs-nav no-scrollbar flex border-b border-border overflow-x-auto bg-bg">
               {tabs.map((t) => (
                  <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`shrink-0 flex items-center gap-1.75 px-6 py-4 font-body text-sm font-medium whitespace-nowrap 
                     border-b-2 transition-all cursor-pointer 
                     ${activeTab === t.id ? "text-green border-green bg-surface" : "text-muted border-transparent bg-transparent"}`}
                  >
                  {t.label}
                  </button>
               ))}
            </div>
            <div className="p-9">
               {activeTab === "overview" && <OverviewTab data={data} />}
               {activeTab === "diet" && <DietTab data={data} />}
               {activeTab === "exercise" && <ExerciseTab data={data} />}
               {activeTab === "tips" && <HealthTipsTab />}
            </div>
         </div>
         <div className="print-row flex justify-end gap-3 mt-6">
            <button
               onClick={() => window.print()}
               className="flex items-center gap-1.75 px-5 py-2.5 border-[1.5px] border-green rounded-[10px] 
                  bg-transparent text-green font-body text-sm font-medium 
                  cursor-pointer transition-all hover:bg-green hover:text-white"
            >
               🖨️ Print / Save PDF
            </button>
            <button
               onClick={() => {
                  calculatorRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                  });
               }}
               className="flex items-center gap-1.75 px-5 py-2.5 border-[1.5px] border-green rounded-[10px] 
                  bg-transparent text-green font-body text-sm font-medium 
                  cursor-pointer transition-all hover:bg-green hover:text-white"
            >
               ↑ Recalculate
            </button>
         </div>
      </div>
   );
}
