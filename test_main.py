from fastapi.testclient import TestClient
from app.main import app, AnalyzeRequest, build_analysis, normalize_skill

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_roles():
    response = client.get("/roles")
    assert response.status_code == 200
    assert "AI / Data Scientist" in response.json()["roles"]


def test_analysis_returns_gaps_and_tasks():
    response = client.post("/analyze", json={
        "target_role": "AI / Data Scientist",
        "experience_level": "Student / Beginner",
        "weekly_hours": 8,
        "skills": ["Python", "SQL"]
    })
    assert response.status_code == 200
    data = response.json()
    assert 0 <= data["coverage_score"] <= 100
    assert len(data["skill_gaps"]) > 0
    assert len(data["tasks"]) > 0
    assert data["assumptions"]


def test_unknown_role_falls_back_safely():
    result = build_analysis(AnalyzeRequest(target_role="Made-up role", skills=["Python"]))
    assert result.target_role == "AI / Data Scientist"


def test_normalize_skill_alias():
    assert normalize_skill("ml") == "Machine learning"
    assert normalize_skill("  python3 ") == "Python"


def test_analysis_rejects_invalid_hours():
    response = client.post("/analyze", json={"weekly_hours": 0})
    assert response.status_code == 422


def test_resume_rejects_wrong_extension():
    response = client.post("/resume/validate", files={"file": ("notes.txt", b"hello", "text/plain")})
    assert response.status_code == 415


def test_resume_rejects_empty_file():
    response = client.post("/resume/validate", files={"file": ("resume.pdf", b"", "application/pdf")})
    assert response.status_code == 400
