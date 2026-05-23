type ScoreBadgeProps = {
  score: number;
  className?: string;
};

export default function ScoreBadge({ score, className = "" }: ScoreBadgeProps) {
  let badgeStyles = "bg-gray-400 text-white";

  if (score >= 90) {
    badgeStyles = "bg-emerald-500 text-white font-bold";
  } else if (score >= 70) {
    badgeStyles = "bg-black text-white font-semibold";
  } else if (score >= 50) {
    badgeStyles = "bg-amber-500 text-white font-medium";
  } else {
    badgeStyles = "bg-gray-400 text-white font-medium";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs tracking-wide rounded-full uppercase select-none ${badgeStyles} ${className}`}
    >
      {score}% Match
    </span>
  );
}
