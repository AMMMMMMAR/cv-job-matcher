import type { Match, CV } from "../types";
import { useMatchi } from "../context/MatchiContext";
import ScoreBadge from "./ScoreBadge";
import JobRequirements from "./JobRequirements";

type MatchCardProps = {
  match: Match;
  cv: CV;
};

export default function MatchCard({ match, cv }: MatchCardProps) {
  const { setSelectedMatch } = useMatchi();
  const { job, match_score, explanation } = match;

  // Compute initials for the company logo placeholder
  const getCompanyLetter = (name: string) => {
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm flex flex-col min-h-[350px] transition-all hover:border-zinc-300 hover:shadow-md duration-300">
      {/* Top row: Logo, Title, and Score */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 bg-black text-white font-bold text-lg flex items-center justify-center rounded-xl flex-shrink-0 select-none shadow-sm">
            {getCompanyLetter(job.company)}
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-bold text-black truncate leading-tight">
              {job.title}
            </h3>
            <p className="text-sm text-zinc-500 truncate mt-0.5">
              {job.company} • {job.location || "Anywhere"}{" "}
              {job.remote && (
                <span className="ml-1.5 px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-xs font-semibold uppercase tracking-wider select-none border border-zinc-200/50">
                  Remote
                </span>
              )}
            </p>
          </div>
        </div>
        <ScoreBadge score={match_score} className="flex-shrink-0" />
      </div>

      {/* Explanation summary */}
      <p className="text-sm leading-relaxed text-zinc-600 mb-5 line-clamp-3">
        {explanation}
      </p>

      {/* Job Requirements Comparisons */}
      <JobRequirements
        job={job}
        candidateSkills={cv.skills}
        candidateExpYears={cv.years_of_experience}
      />

      {/* Actions */}
      <div className="flex justify-between items-center mt-auto pt-2 gap-4">
        <button
          onClick={() => setSelectedMatch(match)}
          className="bg-zinc-100 hover:bg-zinc-200 text-black px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-colors shadow-sm select-none"
        >
          View Fit Analysis
        </button>
        {job.apply_link ? (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-black font-semibold text-xs md:text-sm transition-colors flex items-center gap-1.5 select-none"
          >
            Apply
            <span className="material-symbols-outlined text-[16px] font-bold">
              arrow_forward
            </span>
          </a>
        ) : (
          <button
            type="button"
            className="text-zinc-400 font-semibold text-xs md:text-sm flex items-center gap-1.5 select-none cursor-not-allowed"
            disabled
          >
            Apply Directly
            <span className="material-symbols-outlined text-[16px]">
              block
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
