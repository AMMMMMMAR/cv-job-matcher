import type { Job } from "../types";

type JobRequirementsProps = {
  job: Job;
  candidateSkills: string[];
  candidateExpYears: number | null;
};

export default function JobRequirements({
  job,
  candidateSkills,
  candidateExpYears
}: JobRequirementsProps) {
  // Check how many required skills the candidate possesses
  const matchedSkills = job.required_skills.filter((skill) =>
    candidateSkills.some(
      (cSkill) => cSkill.toLowerCase() === skill.toLowerCase()
    )
  );

  const missingSkills = job.required_skills.filter(
    (skill) =>
      !candidateSkills.some(
        (cSkill) => cSkill.toLowerCase() === skill.toLowerCase()
      )
  );

  // Check if candidate meets experience requirements
  const meetsExperience =
    candidateExpYears !== null &&
    job.required_experience_years !== null &&
    candidateExpYears >= job.required_experience_years;

  return (
    <div className="flex flex-col gap-2.5 pt-3 mb-6 border-t border-zinc-100 text-sm">
      {/* Skills requirements */}
      <div className="flex items-start gap-2.5 text-zinc-500">
        <span
          className={`material-symbols-outlined text-[18px] mt-0.5 select-none ${
            matchedSkills.length === job.required_skills.length
              ? "text-emerald-500 font-bold"
              : "text-zinc-400"
          }`}
        >
          {matchedSkills.length === job.required_skills.length
            ? "check_circle"
            : "check"}
        </span>
        <div className="flex-1">
          <span className="font-semibold text-zinc-800">Required Skills: </span>
          <span className="text-zinc-600">
            {job.required_skills.map((skill, index) => {
              const isMatched = candidateSkills.some(
                (cSkill) => cSkill.toLowerCase() === skill.toLowerCase()
              );
              return (
                <span key={index}>
                  <span
                    className={
                      isMatched
                        ? "text-emerald-600 font-medium"
                        : "text-zinc-500"
                    }
                  >
                    {skill}
                  </span>
                  {index < job.required_skills.length - 1 && ", "}
                </span>
              );
            })}
          </span>
          {missingSkills.length > 0 && (
            <span className="text-zinc-400 text-xs block mt-0.5">
              Missing: {missingSkills.join(", ")}
            </span>
          )}
        </div>
      </div>

      {/* Experience requirements */}
      {job.required_experience_years !== null && (
        <div className="flex items-center gap-2.5 text-zinc-500">
          <span
            className={`material-symbols-outlined text-[18px] select-none ${
              meetsExperience ? "text-emerald-500 font-bold" : "text-zinc-400"
            }`}
          >
            {meetsExperience ? "check_circle" : "check"}
          </span>
          <div>
            <span className="font-semibold text-zinc-800">Experience: </span>
            <span className="text-zinc-600">
              {job.required_experience_years}+ Years Required
            </span>
            {candidateExpYears !== null && (
              <span
                className={`text-xs ml-1.5 ${
                  meetsExperience
                    ? "text-emerald-600 font-medium"
                    : "text-amber-600 font-medium"
                }`}
              >
                (You have {candidateExpYears} Years)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
