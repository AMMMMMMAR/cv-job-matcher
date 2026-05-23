import { useEffect } from "react";
import type { Match } from "../types";

type MatchAnalysisModalProps = {
  match: Match;
  onClose: () => void;
};

export default function MatchAnalysisModal({
  match,
  onClose
}: MatchAnalysisModalProps) {
  const { job, match_score, explanation, matching_strengths, skill_gaps, learning_suggestions } = match;

  // 1. Lock body scroll on mount, restore on unmount
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 2. Add ESC keypress listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // 3. Handle backdrop clicks
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-4 animate-fade-in"
    >
      {/* Modal Container */}
      <section
        className="bg-white w-full max-w-[600px] rounded-2xl shadow-xl border border-zinc-200 flex flex-col max-h-[90vh] overflow-hidden animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 md:p-8 border-b border-zinc-200 flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">
                Match Analysis
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-full text-xs font-bold select-none">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                {match_score}% MATCH
              </span>
            </div>
            <p className="text-sm md:text-base text-zinc-500 font-medium truncate">
              {job.title} at {job.company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-black rounded-lg transition-colors select-none"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8">
          {/* Section 1: Why This Fits You */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <span
                className="material-symbols-outlined text-[22px] select-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <h3 className="text-lg font-bold text-black">Why This Fits You</h3>
            </div>
            
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
              <p className="text-sm leading-relaxed text-zinc-700">
                {explanation}
              </p>
            </div>

            {matching_strengths && matching_strengths.length > 0 ? (
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Your Matching Strengths
                </p>
                <ul className="flex flex-col gap-2.5">
                  {matching_strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5 select-none">
                        check
                      </span>
                      <span className="leading-normal">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Your Matching Strengths
                </p>
                <p className="text-sm text-zinc-500 leading-normal italic pl-1">
                  General candidate experience aligns well with the position.
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Skill Gap Analysis */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-amber-800">
              <span
                className="material-symbols-outlined text-[22px] select-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              <h3 className="text-lg font-bold text-black">Skill Gap Analysis</h3>
            </div>

            {skill_gaps && skill_gaps.length > 0 ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2.5 bg-amber-50/30 border border-amber-100/50 p-4 rounded-xl">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900/60">
                    Skills to Develop
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {skill_gaps.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700">
                        <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5 select-none">
                          priority_high
                        </span>
                        <span className="leading-normal">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 bg-emerald-50/30 border border-emerald-100/50 p-4 rounded-xl">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/60">
                  Skills to Develop
                </p>
                <div className="flex items-start gap-2 text-sm text-zinc-700">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5 select-none">
                    verified
                  </span>
                  <span className="leading-normal font-semibold text-emerald-900">
                    Excellent match! No significant skill gaps were detected for this role.
                  </span>
                </div>
              </div>
            )}

            {/* Learning Suggestions */}
            {learning_suggestions && learning_suggestions.length > 0 ? (
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/50 mt-1">
                <div className="flex items-center gap-2 text-blue-700 mb-2.5">
                  <span
                    className="material-symbols-outlined text-[20px] select-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    lightbulb
                  </span>
                  <p className="text-sm font-semibold text-black">Learning Suggestions</p>
                </div>
                <ul className="flex flex-col gap-2">
                  {learning_suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-xs md:text-sm text-zinc-600 leading-relaxed pl-1">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/50 mt-1">
                <div className="flex items-center gap-2 text-blue-700 mb-2.5">
                  <span
                    className="material-symbols-outlined text-[20px] select-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    thumb_up
                  </span>
                  <p className="text-sm font-semibold text-black">Learning Suggestions</p>
                </div>
                <p className="text-xs md:text-sm text-zinc-600 leading-relaxed pl-1">
                  No specific actions required. Your existing technical stack is a complete match. Focus on highlighting these exact frameworks in your application!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-5 md:px-8 border-t border-zinc-200 flex items-center justify-between bg-zinc-50">
          <button className="text-zinc-500 hover:text-black font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 select-none">
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            Save for later
          </button>
          
          {job.apply_link ? (
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-6 py-3 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md select-none"
            >
              Apply Now
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          ) : (
            <button
              type="button"
              className="bg-zinc-300 text-zinc-500 px-6 py-3 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 cursor-not-allowed select-none"
              disabled
            >
              No direct link
              <span className="material-symbols-outlined text-[18px]">block</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
