export default function FeatureCards() {
  const features = [
    {
      icon: "shield",
      title: "Secure by Design",
      description: "Your uploaded CV is processed securely in volatile memory. We don't store your documents, index your data, or train models with your resume."
    },
    {
      icon: "bolt",
      title: "Instant AI Matching",
      description: "Upload your PDF CV and see top matching tech jobs in 3 seconds. Our fine-tuned AI extracts semantic experience to find roles that match your exact stack."
    },
    {
      icon: "lightbulb",
      title: "Skill Gap Analysis",
      description: "Go beyond simple job descriptions. Get a detailed comparison of your technical skills against job requirements, along with actionable learning recommendations."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col gap-4 transition-all hover:border-zinc-400 hover:shadow-md duration-300"
        >
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center select-none shadow-sm">
            <span className="material-symbols-outlined text-[24px]">
              {feature.icon}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-black tracking-tight">
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed text-zinc-500">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
