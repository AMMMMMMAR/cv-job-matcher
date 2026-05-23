import type { CV, Match } from "../types";

export const mockCV: CV = {
  full_name: "Alex Rivera",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 019-2834",
  location: "San Francisco, CA",
  title: "Senior Software Engineer",
  summary: "Results-driven Senior Software Engineer with over 8 years of experience building high-performance web applications, specialized in TypeScript, React, and server-side runtimes. Proven track record of architecting scalable frontends, contributing to open-source UI libraries, and optimizing cloud infrastructure.",
  skills: ["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "AWS", "GraphQL", "System Design", "Server-Side Rendering (SSR)"],
  years_of_experience: 8,
  work_experience: [
    {
      job_title: "Senior Frontend Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      start_date: "Dec 2021",
      end_date: "Present",
      description: "Led the migration of a legacy dashboard to Next.js, improving Core Web Vitals by 40%. Engineered a reusable custom React component library shared by 15 internal developers, accelerating feature shipping speed by 35%."
    },
    {
      job_title: "Software Engineer",
      company: "WebFlowing",
      location: "San Francisco, CA",
      start_date: "Jun 2018",
      end_date: "Nov 2021",
      description: "Developed and maintained highly responsive user interfaces. Configured serverless backend services using Node.js and AWS API Gateway, handling over 2M requests daily."
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California, Berkeley",
      end_date: "May 2018"
    }
  ]
};

export const mockMatches: Match[] = [
  {
    job: {
      job_id: "stripe-sfa",
      title: "Senior Frontend Architect",
      company: "Stripe",
      location: "San Francisco / Global",
      remote: true,
      employment_type: "Full-time",
      apply_link: "https://stripe.com/jobs",
      required_skills: ["React", "TypeScript", "System Design"],
      nice_to_have_skills: ["Next.js", "GraphQL"],
      required_experience_years: 5,
      seniority: "Senior"
    },
    similarity_score: 0.98,
    match_score: 98,
    explanation: "This role is an exceptional match because of your deep expertise in TypeScript and React component libraries. Stripe's focus on developer experience aligns perfectly with your documented history of building scalable internal tooling for 8 years.",
    matching_strengths: [
      "8+ years of specialized React and TypeScript experience",
      "Proven history of contributing to open-source UI libraries",
      "Strong architectural background in Server-Side Rendering (SSR)"
    ],
    skill_gaps: [
      "Limited experience with Rust for tooling/compilers",
      "Edge Middleware optimization techniques"
    ],
    learning_suggestions: [
      "Complete 'Rust for JavaScript Developers' on Frontend Masters",
      "Review Vercel's Edge Functions documentation and case studies"
    ]
  },
  {
    job: {
      job_id: "linear-sfd",
      title: "Senior Full-Stack Developer",
      company: "Linear",
      location: "New York City",
      remote: false,
      employment_type: "Full-time",
      apply_link: "https://linear.app/careers",
      required_skills: ["TypeScript", "Node.js", "PostgreSQL"],
      nice_to_have_skills: ["GraphQL", "React Native"],
      required_experience_years: 5,
      seniority: "Senior"
    },
    similarity_score: 0.85,
    match_score: 85,
    explanation: "Linear's stack and design-focused culture matches your history of creating high-performance UIs. The 15% gap is due to their requirement for GraphQL experience, which is listed as a secondary skill on your profile.",
    matching_strengths: [
      "Exceptional skills in TypeScript and Node.js backend workflows",
      "8 years of building high-performance modern web platforms",
      "Strong command over PostgreSQL database structuring and scaling"
    ],
    skill_gaps: [
      "No direct React Native experience listed for mobile cross-integration",
      "GraphQL experience is present but not highlighted in production workloads"
    ],
    learning_suggestions: [
      "Build a demo application using Apollo Client and GraphQL yoga server",
      "Go through the official React Native introductory paths"
    ]
  },
  {
    job: {
      job_id: "scale-bsl",
      title: "Backend Systems Lead",
      company: "Scale AI",
      location: "San Francisco",
      remote: false,
      employment_type: "Full-time",
      apply_link: null, // Test apply_link is null
      required_skills: ["Python", "AWS", "Kubernetes"],
      nice_to_have_skills: ["Node.js", "PostgreSQL"],
      required_experience_years: 8,
      seniority: "Lead"
    },
    similarity_score: 0.72,
    match_score: 72,
    explanation: "A solid match for your Node.js and AWS infrastructure skills. This role prioritizes data engineering and Python, which are less prominent in your recent work, resulting in a lower overall score compared to frontend roles.",
    matching_strengths: [
      "Strong expertise managing scalable AWS clouds and serverless systems",
      "Excellent PostgreSQL schema building and execution",
      "Leadership capacity shown by mentoring teams and designing libraries"
    ],
    skill_gaps: [
      "Lack of production Python experience for AI/ML pipeline structures",
      "No listed experience orchestrating containers using Kubernetes"
    ],
    learning_suggestions: [
      "Take the 'Complete Python Bootcamp' to brush up on backend scripting",
      "Earn a Kubernetes certification (CKA) or complete intermediate courses"
    ]
  },
  {
    job: {
      job_id: "vercel-dre",
      title: "Developer Relations Engineer",
      company: "Vercel",
      location: "Remote / Global",
      remote: true,
      employment_type: "Full-time",
      apply_link: "https://vercel.com/careers",
      required_skills: ["Next.js", "React", "Public Speaking"],
      nice_to_have_skills: ["TypeScript", "Technical Writing"],
      required_experience_years: 3,
      seniority: "Mid-Senior"
    },
    similarity_score: 0.65,
    match_score: 65,
    explanation: "Vercel relies heavily on Next.js, matching your technical profile. However, this role is a DevRel position requiring extensive public speaking, community advocacy, and content creation, which are not listed in your CV.",
    matching_strengths: [
      "World-class knowledge of the Next.js ecosystem and components",
      "Excellent frontend portfolio utilizing Tailwind CSS and glassmorphism",
      "Solid technical writing skills reflected in clean documentation"
    ],
    skill_gaps: [
      "No developer community management experience",
      "Public speaking or video presentation records are missing from your profile"
    ],
    learning_suggestions: [
      "Start a technical blog or record YouTube tutorials focusing on Next.js",
      "Apply to speak at local tech meetups or host small developer workshops"
    ]
  },
  {
    job: {
      job_id: "netflix-sja",
      title: "Senior Java Systems Architect",
      company: "Netflix",
      location: "Los Gatos, CA",
      remote: false,
      employment_type: "Full-time",
      apply_link: "https://jobs.netflix.com",
      required_skills: ["Java", "Spring Boot", "Microservices"],
      nice_to_have_skills: ["AWS", "NoSQL"],
      required_experience_years: 10,
      seniority: "Staff/Senior"
    },
    similarity_score: 0.45,
    match_score: 45,
    explanation: "This role requires deep expertise in Java and Spring Boot for high-throughput microservices. While you have strong AWS skills, your profile is primarily JavaScript/TypeScript-based, causing a major structural stack mismatch.",
    matching_strengths: [
      "High-scale systems thinking matching Netflix's engineering principles",
      "Extensive experience with AWS infrastructure and cloud orchestration"
    ],
    skill_gaps: [
      "No production Java or Spring Boot framework experience",
      "Relational SQL focus rather than Netflix's high-scale NoSQL architectures"
    ],
    learning_suggestions: [
      "Complete 'Java Programming Masterclass' and Spring Boot patterns",
      "Experiment with Cassandra or MongoDB for high-write databases"
    ]
  }
];
