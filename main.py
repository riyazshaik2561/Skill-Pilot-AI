from __future__ import annotations

import re
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="SkillPilot AI API",
    description="Demo-friendly career skill analysis and roadmap API.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

ROLE_SKILLS: dict[str, dict[str, int]] = {
    "AI / Data Scientist": {
        "Python": 4, "Data analysis": 4, "Machine learning": 4,
        "SQL": 3, "Deployment": 3, "Statistics": 4,
    },
    "Software Developer": {
        "Programming fundamentals": 4, "Data structures": 4,
        "Testing": 3, "APIs": 3, "Databases": 3, "Deployment": 2,
    },
    "Data Analyst": {
        "SQL": 4, "Data analysis": 4, "Data visualization": 4,
        "Spreadsheets": 3, "Statistics": 3, "Python": 2,
    },
    "Cloud Engineer": {
        "Linux": 3, "Networking": 3, "Cloud fundamentals": 4,
        "Automation": 3, "Security": 3, "Deployment": 4,
    },
    "AI Engineer": {
        "Python": 4, "Machine learning": 4, "APIs": 3,
        "LLM fundamentals": 3, "Evaluation": 3, "Deployment": 3,
    },
}
ALIASES = {
    "py": "Python", "python3": "Python", "pandas": "Data analysis",
    "data analytics": "Data analysis", "ml": "Machine learning",
    "machine learning": "Machine learning", "postgres": "SQL",
    "postgresql": "SQL", "rest api": "APIs", "fastapi": "APIs",
}


class AnalyzeRequest(BaseModel):
    target_role: str = "AI / Data Scientist"
    experience_level: str = "Student / Beginner"
    weekly_hours: int = Field(default=8, ge=1, le=60)
    skills: list[str] = Field(default_factory=lambda: ["Python", "Data analysis", "SQL"])
    proficiency: dict[str, int] = Field(default_factory=dict)


class Task(BaseModel):
    week: int
    title: str
    description: str
    estimated_hours: int = Field(ge=1, le=40)
    skill: str
    completion_criteria: str


class RoadmapResponse(BaseModel):
    target_role: str
    coverage_score: int
    strengths: list[str]
    skill_gaps: list[dict]
    tasks: list[Task]
    assumptions: list[str]


def normalize_skill(skill: str) -> str:
    cleaned = re.sub(r"\s+", " ", skill.strip())
    if not cleaned:
        return ""
    return ALIASES.get(cleaned.casefold(), cleaned.title() if cleaned.isupper() else cleaned)


def build_analysis(request: AnalyzeRequest) -> RoadmapResponse:
    role = request.target_role if request.target_role in ROLE_SKILLS else "AI / Data Scientist"
    requirements = ROLE_SKILLS[role]
    normalized = {normalize_skill(s) for s in request.skills if normalize_skill(s)}
    skill_levels = {name: max(0, min(5, request.proficiency.get(name, 2 if name in normalized else 0)))
                    for name in requirements}
    # Transparent weighted skill coverage; this is not a hiring probability.
    total_weight = sum(requirements.values())
    weighted = sum(
        importance * min(skill_levels[name] / required, 1)
        for name, required in requirements.items()
    )
    score = round(weighted / total_weight * 100) if total_weight else 0
    strengths = [name for name, level in skill_levels.items() if level >= requirements[name]]
    gaps = []
    for name, required in requirements.items():
        current = skill_levels[name]
        if current < required:
            gaps.append({
                "skill": name,
                "current_level": current,
                "target_level": required,
                "gap": required - current,
                "importance": requirements[name],
                "priority": "High" if required - current >= 2 else "Medium",
                "suggestion": f"Complete one practical {name} exercise and document the result.",
            })
    gaps.sort(key=lambda item: (-item["gap"], -item["importance"], item["skill"]))
    tasks: list[Task] = []
    for idx, gap in enumerate(gaps[:6]):
        skill = gap["skill"]
        tasks.append(Task(
            week=(idx // 2) + 1,
            title=f"Build confidence in {skill}",
            description=f"Study the core concepts of {skill}, then apply them in a small practical exercise.",
            estimated_hours=max(1, min(6, request.weekly_hours // 2 or 1)),
            skill=skill,
            completion_criteria=f"Finish one exercise and write a short explanation of your approach to {skill}.",
        ))
    if not tasks:
        tasks.append(Task(
            week=1, title="Build a capstone project",
            description=f"Combine your strongest skills in a project aligned with {role}.",
            estimated_hours=min(6, request.weekly_hours),
            skill="Portfolio",
            completion_criteria="Publish a README, a reproducible demo, and a short reflection.",
        ))
    return RoadmapResponse(
        target_role=role,
        coverage_score=score,
        strengths=strengths,
        skill_gaps=gaps,
        tasks=tasks,
        assumptions=[
            "Skill levels are estimates and should be reviewed by the student.",
            "Coverage score measures skill coverage, not probability of employment.",
            "Roadmap tasks are deterministic starter recommendations, not live course listings.",
        ],
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "skillpilot-ai-api"}


@app.get("/roles")
def list_roles() -> dict[str, list[str]]:
    return {"roles": list(ROLE_SKILLS.keys())}


@app.post("/analyze", response_model=RoadmapResponse)
def analyze(request: AnalyzeRequest) -> RoadmapResponse:
    return build_analysis(request)


@app.post("/resume/validate")
async def validate_resume(file: UploadFile = File(...)) -> dict[str, str | int]:
    name = file.filename or ""
    suffix = Path(name).suffix.lower()
    if suffix not in {".pdf", ".docx"}:
        raise HTTPException(status_code=415, detail="Only PDF and DOCX files are supported.")
    content = await file.read(8 * 1024 * 1024 + 1)
    if len(content) > 8 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File exceeds the 8 MB limit.")
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    # This endpoint validates the upload only. It deliberately does not claim to parse
    # resume content; parsing can be added using vetted PDF/DOCX libraries.
    return {"filename": Path(name).name, "size_bytes": len(content), "status": "validated", "message": "File accepted for a future parsing integration."}
