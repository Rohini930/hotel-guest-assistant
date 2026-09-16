def test_health(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


def test_chat_requires_message(client):
    response = client.post("/api/chat", json={})

    assert response.status_code == 400


def test_chat_without_key(monkeypatch, client):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    response = client.post(
        "/api/chat",
        json={
            "message": "What time is check-in?",
            "conversation": []
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "message" in data
    assert "answer" in data["message"]
    assert isinstance(data["message"]["answer"], str)
    assert len(data["message"]["answer"]) > 0


def test_chat_accepts_conversation_context(client):
    response = client.post(
        "/api/chat",
        json={
            "message": "What about breakfast for that room?",
            "conversation": [
                {
                    "role": "user",
                    "content": "Which room is suitable for three guests?"
                },
                {
                    "role": "assistant",
                    "content": "The Family Suite can accommodate up to four guests."
                }
            ]
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "message" in data
    assert "answer" in data["message"]
    assert isinstance(data["message"]["answer"], str)


def test_availability_valid(client):
    response = client.post(
        "/api/availability",
        json={
            "check_in": "2026-10-10",
            "check_out": "2026-10-12",
            "adults": 3
        }
    )

    data = response.get_json()

    assert response.status_code == 200
    assert data["available"] is True
    assert data["nights"] == 2


def test_availability_for_two_guests(client):
    response = client.post(
        "/api/availability",
        json={
            "check_in": "2026-10-10",
            "check_out": "2026-10-12",
            "adults": 2
        }
    )

    data = response.get_json()

    assert response.status_code == 200
    assert data["available"] is True
    assert len(data["rooms"]) >= 1

    for room in data["rooms"]:
        assert room["capacity"] >= 2


def test_bad_dates(client):
    response = client.post(
        "/api/availability",
        json={
            "check_in": "2026-10-12",
            "check_out": "2026-10-10",
            "adults": 2
        }
    )

    assert response.status_code == 400


def test_bad_guest_count(client):
    response = client.post(
        "/api/availability",
        json={
            "check_in": "2026-10-10",
            "check_out": "2026-10-12",
            "adults": 0
        }
    )

    assert response.status_code == 400


def test_no_room_for_five(client):
    response = client.post(
        "/api/availability",
        json={
            "check_in": "2026-10-10",
            "check_out": "2026-10-12",
            "adults": 5
        }
    )

    data = response.get_json()

    assert response.status_code == 200
    assert data["available"] is False


def test_availability_requires_dates(client):
    response = client.post(
        "/api/availability",
        json={
            "adults": 2
        }
    )

    assert response.status_code == 400