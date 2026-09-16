# Hotel Guest Assistant

A full-stack AI-powered hotel guest assistant built for the take-home assignment.

The application provides a hotel-style guest experience where users can:

- Ask questions about the hotel
- Get information about rooms, amenities, breakfast and policies
- Ask follow-up questions using conversation context
- Check room availability using dates and number of guests
- Receive clear availability results
- Get a graceful fallback when the AI service is unavailable

---

## 1. Problem Statement

Hotel guests often need quick answers about check-in times, amenities, room suitability, breakfast, policies and room availability.

The goal of this project is to provide a simple digital guest assistant that can answer property-related questions conversationally while keeping important business logic, such as room availability, deterministic and controlled by the backend.

The assistant is designed to reduce friction during the guest journey by allowing guests to get common hotel information and check room availability from one interface.

---

## 2. Customer Problem

A hotel guest may need information such as:

- What time is check-in?
- What time is check-out?
- Does the hotel have a swimming pool?
- Which room is suitable for three guests?
- Is breakfast included?
- What are the hotel policies?
- Are rooms available for specific dates?

Without an assistant, guests may need to search through hotel pages or contact hotel staff for simple questions.

This project provides a conversational interface for common questions while keeping availability logic separate and deterministic.

---

## 3. Guest Journey

The intended guest journey is:

```text
Guest opens hotel website
        ↓
Explores hotel information
        ↓
Opens Guest Assistant
        ↓
Asks a question
        ↓
Assistant provides an answer
        ↓
Guest can ask a follow-up question
        ↓
Guest can check room availability
        ↓
Availability results are displayed as room cards
```

The guest does not need to understand the underlying AI or backend architecture.

---

## 4. Key Features

### Guest Assistant

The assistant supports natural-language questions about:

- Check-in and check-out
- Rooms
- Room capacity
- Swimming pool
- Fitness centre
- Wi-Fi
- Breakfast
- Hotel policies
- Other hotel FAQs

### Conversation Context

Previous messages are sent with the current question so that follow-up questions can be understood.

Example:

**Guest:**  
Which room is suitable for three guests?

**Assistant:**  
The Family Suite can accommodate up to four guests.

**Guest:**  
What about breakfast for that room?

The assistant can use the previous conversation to understand that "that room" refers to the Family Suite.

### Room Availability

Guests can provide:

- Check-in date
- Check-out date
- Number of adults

The backend performs deterministic availability checking and returns matching rooms.

### Failure Handling

If the AI service is unavailable, the application displays a user-friendly fallback instead of crashing.

Example:

> I'm sorry, I'm having trouble processing that right now. Please try again in a moment.

### Responsive Hotel UI

The frontend is designed as a hotel website rather than a generic chatbot.

It includes:

- Hotel-style navigation
- Hero section
- Guest assistant
- Suggested questions
- Availability search
- Room result cards
- Amenities section
- Loading states
- Error states
- Responsive layout

---

## 5. Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Lucide React icons

### Backend

- Python
- Flask
- Flask-CORS
- REST API
- JSON hotel knowledge base
- Pytest

### AI

- Google Gemini API
- `google-genai` Python SDK

---

## 6. Architecture

```text
                    ┌─────────────────────┐
                    │     Hotel Guest     │
                    │       Website       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │   Chat UI           │
                    │   Availability Form │
                    │   Loading/Error     │
                    └──────────┬──────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Flask Backend     │
                    │                     │
                    │   /api/chat         │
                    │   /api/availability │
                    └───────┬───────┬─────┘
                            │       │
              ┌─────────────┘       └─────────────┐
              ▼                                   ▼
    ┌────────────────────┐             ┌────────────────────┐
    │  Hotel Knowledge   │             │   Deterministic    │
    │  Base (JSON)       │             │ Availability Logic │
    └─────────┬──────────┘             └─────────┬──────────┘
              │                                  │
              ▼                                  │
    ┌────────────────────┐                       │
    │    Gemini API      │                       │
    │                    │                       │
    │ Natural-language   │                       │
    │ responses          │                       │
    └─────────┬──────────┘                       │
              │                                  │
              └────────────────┬─────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │  Structured API     │
                    │      Response       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      React UI       │
                    │                     │
                    │  Answer / Rooms     │
                    └─────────────────────┘
```

---

## 7. AI vs Deterministic Logic

A key design decision was to separate conversational AI from business logic.

### Gemini is used for:

- Natural-language understanding
- Conversational responses
- Follow-up questions
- Generating friendly responses based on the hotel knowledge base

### Backend deterministic logic is used for:

- Date validation
- Guest-count validation
- Room capacity checks
- Availability calculation
- Number of nights
- Returning room results

The LLM is therefore **not responsible for deciding whether a room is available**.

This reduces the risk of the model inventing availability information and keeps business rules under backend control.

---

## 8. Hotel Knowledge Base

Hotel information is stored in:

```text
backend/app/hotel_data.json
```

The backend loads the information through:

```text
backend/app/data.py
```

The knowledge base acts as the source of truth for the hotel information supplied to the AI assistant.

The assistant is instructed to:

- Use the provided hotel information
- Avoid inventing facilities
- Avoid inventing policies
- Avoid inventing room information
- Avoid inventing availability
- Clearly state when information is unavailable

---

## 9. Conversation Context

The frontend maintains the current conversation and sends previous messages to the backend.

The request contains:

```json
{
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
```

The backend passes the relevant conversation context to Gemini along with the hotel knowledge base.

This allows the assistant to answer follow-up questions naturally.

---

## 10. Chat Flow

```text
Guest question
      ↓
React frontend
      ↓
POST /api/chat
      ↓
Flask backend
      ↓
Hotel knowledge base
      +
Conversation context
      ↓
Gemini
      ↓
Structured response
      ↓
React frontend
      ↓
Assistant message
```

---

## 11. Availability Flow

Availability is intentionally handled separately from the LLM.

Guest enters:

- Check-in date
- Check-out date
- Number of adults

Flow:

```text
Guest enters dates and guests
          ↓
React
          ↓
POST /api/availability
          ↓
Flask
          ↓
Validate request
          ↓
Deterministic availability function
          ↓
Check room capacity/date rules
          ↓
Return matching rooms
          ↓
React displays room cards
```

Availability results are displayed in the dedicated availability section and are not added to the conversational chat.

This keeps the guest conversation clean and prevents repeated availability searches from creating unnecessary chat messages.

---

## 12. API Endpoints

### Health Check

**GET**

```text
/api/health
```

Example:

```bash
curl http://127.0.0.1:5000/api/health
```

Expected response:

```json
{
  "service": "hotel-guest-assistant-backend",
  "status": "ok"
}
```

### Chat

**POST**

```text
/api/chat
```

Request:

```json
{
  "message": "What time is check-in?",
  "conversation": []
}
```

The API also accepts conversation context for follow-up questions.

Example:

```json
{
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
```

### Availability

**POST**

```text
/api/availability
```

Request:

```json
{
  "check_in": "2026-10-10",
  "check_out": "2026-10-12",
  "adults": 3
}
```

The response contains:

- Availability status
- Number of nights
- Requested guest count
- Matching room information

---

## 13. API Response Structure

The chat endpoint returns a structured response.

Example:

```json
{
  "message": {
    "answer": "Our check-in time is 2:00 PM.",
    "fallback": false
  }
}
```

When the AI service fails, the response can indicate fallback behavior:

```json
{
  "message": {
    "answer": "I'm sorry, I'm having trouble processing that right now. Please try again in a moment.",
    "fallback": true
  }
}
```

---

## 14. Project Structure

```text
hotel-guest-assistant/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── availability.py
│   │   ├── ai_service.py
│   │   ├── data.py
│   │   ├── hotel_data.json
│   │   └── routes.py
│   │
│   ├── tests/
│   │   ├── conftest.py
│   │   └── test_api.py
│   │
│   ├── .env.example
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AvailabilityForm.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   └── RoomCard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── .env.example
│   ├── package.json
│   └── index.html
│
├── README.md
└── TEST_PLAN.md
```

---

## 15. Requirements

### Backend

- Python 3.11+
- Gemini API key

### Frontend

- Node.js 20+
- npm

---

## 16. Environment Variables

### Backend

Create:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The Gemini API key must remain on the backend.

It must **not** be placed in the React frontend.

The repository includes:

```text
backend/.env.example
```

as a safe template.

### Frontend

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000/api
```

The frontend only receives the backend API URL and never receives the Gemini API key.

---

## 17. Running the Backend

Open a terminal:

```bash
cd backend
```

### Create a virtual environment

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

#### macOS/Linux

```bash
python -m venv venv
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Create the environment file

#### Windows

```bash
copy .env.example .env
```

#### macOS/Linux

```bash
cp .env.example .env
```

Add the Gemini API key to `.env`.

### Start Flask

```bash
python run.py
```

Backend:

```text
http://127.0.0.1:5000
```

Health endpoint:

```text
http://127.0.0.1:5000/api/health
```

---

## 18. Running the Frontend

Open another terminal:

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Create the environment file

#### Windows

```bash
copy .env.example .env
```

#### macOS/Linux

```bash
cp .env.example .env
```

### Start the development server

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 19. Automated Tests

Backend tests are written using Pytest.

Run:

```bash
cd backend
python -m pytest -v
```

Current result:

```text
10 passed
```

The test suite covers:

1. Health endpoint
2. Missing chat message
3. Chat response structure
4. Conversation context
5. Valid availability
6. Availability for two guests
7. Invalid dates
8. Invalid guest count
9. No room for five guests
10. Missing availability dates

---

## 20. Manual Evaluation

The application was manually tested against the main guest journeys.

| # | Evaluation Scenario | Result |
|---|---|---|
| 1 | Guest asks about check-in time | PASS |
| 2 | Guest asks about swimming pool | PASS |
| 3 | Guest asks which room suits three guests | PASS |
| 4 | Guest asks whether breakfast is included | PASS |
| 5 | Guest asks a follow-up using previous context | PASS |
| 6 | Guest checks room availability | PASS |
| 7 | Guest enters invalid dates | PASS |
| 8 | Guest changes dates/guest count and results update | PASS |
| 9 | Guest asks about unsupported hotel information | PASS |
| 10 | AI service failure is simulated | PASS |

---

## 21. AI Failure and Fallback

The application handles AI service failures gracefully.

When the Gemini service is unavailable or the API request fails, the backend catches the exception and returns a fallback response.

Example:

```text
I'm sorry, I'm having trouble processing that right now.
Please try again in a moment.
```

The frontend displays this message instead of crashing.

The failure test was performed by temporarily using an invalid Gemini API key.

After restoring the valid key, the normal AI response was verified again.

---

## 22. Hallucination Prevention

The assistant receives the hotel's knowledge base as context.

The AI instructions explicitly tell the model to:

- Use only the provided hotel information
- Not invent hotel facilities
- Not invent hotel policies
- Not invent room information
- Not make availability decisions
- State when information is unavailable

For example, if a guest asks about a facility that is not included in the knowledge base, the assistant should avoid confidently claiming that the facility exists.

---

## 23. Why Availability Is Not Handled by the LLM

Room availability is a business rule rather than a conversational generation task.

Using an LLM to decide availability could result in an invented or inconsistent answer.

Instead:

```text
Dates + Guest Count
        ↓
Backend validation
        ↓
Room capacity/date rules
        ↓
Deterministic result
```

The LLM is only responsible for conversational responses.

This separation makes the system easier to test and reason about.

---

## 24. UX Decisions

The interface was intentionally designed to feel like a real hotel website rather than a generic chatbot.

### Hotel-style presentation

The UI includes:

- Hotel branding
- Hero section
- Navigation
- Hotel imagery
- Amenities section
- Dedicated guest-assistant area
- Availability section
- Conversational assistant

### Chat experience

The chat includes:

- Clear user and assistant messages
- Suggested questions
- Typing/loading state
- Input field
- Error feedback
- Conversation history

### Availability experience

Availability has its own dedicated section containing:

- Date selection
- Guest selection
- Loading state
- Room result cards
- Room capacity
- Price information
- Number of nights
- No-result state

This separation prevents the availability workflow from cluttering the guest conversation.

---

## 25. Error Handling

The application handles several error scenarios.

### Missing chat message

The backend validates the request and returns an error when a message is missing.

### Invalid dates

The availability API rejects invalid date ranges.

### Invalid guest count

The availability API rejects invalid guest counts.

### Missing availability information

The backend validates required availability fields.

### AI failure

Gemini failures are caught and converted into a user-friendly fallback.

### Frontend loading

The UI displays a typing/loading state while waiting for the AI response.

---

## 26. Production Considerations

The current application intentionally uses mock availability because the assignment asks for a small working implementation.

Before production, the following could be considered.

### Real Inventory

Integrate with a real hotel/property-management or booking system.

### Observability

Add:

- Structured logs
- Metrics
- Error tracking
- Request tracing
- AI latency monitoring

### Security

Add:

- API rate limiting
- Input sanitization
- Secret management
- Security headers
- Proper CORS configuration
- Authentication where required

### AI Reliability

Add:

- Automated AI evaluations
- Prompt/version tracking
- Response-quality monitoring
- Hallucination monitoring
- Model fallback strategies

### Guest Experience

Add:

- Human escalation
- Multilingual support
- Persistent guest sessions
- Accessibility improvements
- More detailed room information

### Deployment

Add:

- CI/CD
- Production hosting
- Automated testing in CI
- Environment-specific configuration

---

## 27. Success Metrics

Potential production metrics include:

### Guest usefulness

- Percentage of questions successfully answered
- Guest satisfaction after assistant interactions
- Percentage of conversations requiring human escalation

### Availability journey

- Availability search completion rate
- Percentage of searches resulting in a suitable room
- Time taken to complete an availability search

### AI quality

- Grounded-answer rate
- Unsupported-question handling rate
- Follow-up question success rate
- AI failure rate

### Technical performance

- API response latency
- Gemini request latency
- Backend error rate
- Frontend error rate

---

## 28. Scope and Prioritization

The implementation focuses on the core assignment requirements within the suggested development time.

The project prioritizes:

- A realistic guest-facing experience
- Reliable hotel information
- Deterministic availability logic
- AI-powered conversational interaction
- Conversation context
- Graceful failure handling
- Backend validation
- Automated testing
- Clear documentation

Features outside the core assignment scope, such as payments, authentication and real production inventory integration, were intentionally not added.

This keeps the implementation focused on the requirements of the assignment rather than adding unnecessary complexity.

---

## 29. AI Tools Used

AI assistance was used during development for:

- Code drafting
- Debugging
- Troubleshooting
- Documentation support
- Reviewing implementation decisions

The final implementation was reviewed and tested manually and through automated backend tests.

The developer should be able to explain:

- The architecture
- API flow
- AI usage
- Deterministic availability logic
- Error handling
- Testing strategy

---

## 30. Final Verification

Before submission, verify:

- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] `/api/health` returns status `"ok"`
- [ ] Check-in question works
- [ ] Amenity question works
- [ ] Room suitability question works
- [ ] Breakfast question works
- [ ] Follow-up question works
- [ ] Availability search works
- [ ] Invalid dates are handled
- [ ] No-room scenario is handled
- [ ] AI failure fallback works
- [ ] Backend tests pass
- [ ] API key is not committed
- [ ] `.env` is ignored by Git
- [ ] README setup instructions work
- [ ] GitHub repository contains frontend and backend

---

## 31. Conclusion

The Hotel Guest Assistant combines a conversational AI experience with deterministic backend business logic.

The design intentionally keeps the LLM responsible for natural-language interaction while keeping availability and validation under backend control.

The result is a small, testable full-stack application that demonstrates:

- Full-stack development
- REST API integration
- AI integration
- Conversation context
- Deterministic business logic
- Error handling
- Responsive UI design
- Automated testing
- Product and UX thinking