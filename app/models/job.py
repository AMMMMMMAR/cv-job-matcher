from pydantic import BaseModel, Field
from typing import Optional

class Job(BaseModel):
    job_id: str
    title: str
    company: str
    location: Optional[str] = None
    remote: bool = False
    employment_type: Optional[str] = None   # FULLTIME, CONTRACT, etc.
    description: str
    required_skills: list[str] = Field(default_factory=list)
    nice_to_have_skills: list[str] = Field(default_factory=list)
    required_experience_years: Optional[float] = None
    seniority: Optional[str] = None         # "junior" | "mid" | "senior"
    apply_link: Optional[str] = None
    posted_date: Optional[str] = None
    source: str = "jsearch"
