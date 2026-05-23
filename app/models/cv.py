from pydantic import BaseModel, Field
from typing import Optional

class WorkExperience(BaseModel):
    job_title: str
    company: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None

class Education(BaseModel):
    degree: str
    institution: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    gpa: Optional[str] = None

class Project(BaseModel):
    name: str
    description: Optional[str] = None
    technologies: list[str] = Field(default_factory=list)
    url: Optional[str] = None

class Certification(BaseModel):
    name: str
    issuer: Optional[str] = None
    date: Optional[str] = None

class CV(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    website: Optional[str] = None
    title: Optional[str] = None
    summary: Optional[str] = None
    skills: list[str] = Field(default_factory=list)
    work_experience: list[WorkExperience] = Field(default_factory=list)
    education: list[Education] = Field(default_factory=list)
    projects: list[Project] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)
    years_of_experience: Optional[float] = None
