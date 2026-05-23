import type { CV } from "../types";

type CVSummaryCardProps = {
  cv: CV;
};

export default function CVSummaryCard({ cv }: CVSummaryCardProps) {
  // Compute user initials (e.g. "Alex Rivera" -> "AR")
  const getInitials = (name: string | null) => {
    if (!name) return "CV";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm flex flex-col gap-6 w-full max-w-[400px]">
      {/* Header Info */}
      <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
        <div className="w-16 h-16 rounded-full bg-black text-white font-bold text-xl flex items-center justify-center select-none shadow-sm flex-shrink-0">
          {getInitials(cv.full_name)}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-black truncate">
            {cv.full_name || "Applicant Name"}
          </h3>
          <p className="text-sm text-zinc-500 truncate">
            {cv.title || "Software Specialist"}
          </p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="flex flex-col gap-3">
        {cv.email && (
          <div className="flex items-center gap-3 text-zinc-600 text-sm">
            <span className="material-symbols-outlined text-[18px] text-zinc-400 select-none">mail</span>
            <span className="truncate">{cv.email}</span>
          </div>
        )}
        {cv.phone && (
          <div className="flex items-center gap-3 text-zinc-600 text-sm">
            <span className="material-symbols-outlined text-[18px] text-zinc-400 select-none">phone</span>
            <span className="truncate">{cv.phone}</span>
          </div>
        )}
        {cv.location && (
          <div className="flex items-center gap-3 text-zinc-600 text-sm">
            <span className="material-symbols-outlined text-[18px] text-zinc-400 select-none">location_on</span>
            <span className="truncate">{cv.location}</span>
          </div>
        )}
      </div>

      {/* Work Experience Timeline */}
      {cv.work_experience && cv.work_experience.length > 0 && (
        <div className="border-t border-zinc-100 pt-4 flex flex-col gap-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Work Experience
          </h4>
          <div className="flex flex-col gap-4">
            {cv.work_experience.map((exp, idx) => {
              const isLast = idx === cv.work_experience.length - 1;
              return (
                <div key={idx} className="flex gap-4 relative">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 z-10 border ${
                        idx === 0
                          ? "bg-black border-black"
                          : "bg-zinc-100 border-zinc-300"
                      }`}
                    ></div>
                    {!isLast && (
                      <div className="w-[1.5px] bg-zinc-200 flex-1 -my-1"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-black leading-tight">
                      {exp.job_title}
                    </h5>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {exp.company} • {exp.start_date || "N/A"} - {exp.end_date || "Present"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Extracted Skills */}
      {cv.skills && cv.skills.length > 0 && (
        <div className="border-t border-zinc-100 pt-4">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Extracted Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {cv.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-zinc-100 text-zinc-800 text-xs font-medium rounded-full border border-zinc-200/50"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
