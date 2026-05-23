export default function FlowDiagram() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <div className="w-full h-full bg-zinc-100 p-2 rounded-2xl overflow-hidden border border-zinc-200 transition-all hover:border-zinc-400 shadow-sm duration-300">
        <img
          alt="Matchi: AI Job Matching Flow"
          className="w-full h-full object-contain rounded-xl select-none"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpLRE-K-tPV2gfucj-oO91OBjah-YZ3U_gjQe8Ypa0_5sxDvHkj99kQFQlzJ8MW7EDXyPKfTvNTqyZR0N2EfU5Zy4M_W7-XeRhchTOtLcJYJXPU586iEEz8blKlR4Cp7dvTUJsjytX8oqbpO8wfjlJeTT7PYA0wHwJvBAZbKa_bHWNSsankRQAXohaVolzv1Qv89qS9-OfIX8Gou_gDanM8UejaHsYsPrM6XC_LRAlFz76EFQvOfYRPznHjFYjJPMO59633-DJGpA8"
          onError={(e) => {
            // Fallback in case external image fails to load
            e.currentTarget.style.display = "none";
          }}
        />
        {/* A beautiful visual fallback / overlay just in case the image fails or load delay occurs */}
        <div className="flex-col gap-4 p-6 hidden md:flex h-full justify-between bg-white rounded-xl">
          <div className="flex justify-between items-center w-full">
            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Matching Flow</h4>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
              <div className="text-2xl font-black text-black">01</div>
              <div className="text-sm font-semibold text-zinc-800 mt-1">Upload CV</div>
              <div className="text-xs text-zinc-500 mt-0.5">PDF processing</div>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
              <div className="text-2xl font-black text-black">02</div>
              <div className="text-sm font-semibold text-zinc-800 mt-1">AI Parse</div>
              <div className="text-xs text-zinc-500 mt-0.5">Semantic extraction</div>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
              <div className="text-2xl font-black text-black">03</div>
              <div className="text-sm font-semibold text-zinc-800 mt-1">Match Roles</div>
              <div className="text-xs text-zinc-500 mt-0.5">Semantic mapping</div>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
              <div className="text-2xl font-black text-black">04</div>
              <div className="text-sm font-semibold text-zinc-800 mt-1">Analysis</div>
              <div className="text-xs text-zinc-500 mt-0.5">Strengths & Gaps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
