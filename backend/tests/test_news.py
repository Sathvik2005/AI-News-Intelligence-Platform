from fastapi.testclient import TestClient

from app.main import app


def test_news_list() -> None:
    client = TestClient(app)
    response = client.get("/api/v1/news")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
