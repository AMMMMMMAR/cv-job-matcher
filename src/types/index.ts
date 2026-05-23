export type WorkExperience = {
  job_title: string;
  company: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
};

export type Education = {
  degree: string;
  institution: string;
  end_date: string | null;
};

export type CV = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  title: string | null;
  summary: string | null;
  skills: string[];
  work_experience: WorkExperience[];
  education: Education[];
  years_of_experience: number | null;
};

export type Job = {
  job_id: string;
  title: string;
  company: string;
  location: string | null;
  remote: boolean;
  employment_type: string | null;
  apply_link: string | null;
  required_skills: string[];
  nice_to_have_skills: string[];
  required_experience_years: number | null;
  seniority: string | null;
};

export type Match = {
  job: Job;
  similarity_score: number;
  match_score: number;
  explanation: string;
  matching_strengths: string[];
  skill_gaps: string[];
  learning_suggestions: string[];
};

export type AppState = "idle" | "loading" | "results";

export type UploadResponse = {
  cv: CV;
  matches: Match[];
};
