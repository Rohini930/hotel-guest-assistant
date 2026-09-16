# Evaluation / Test Plan

1. Check-in time question -> grounded hotel answer.
2. Swimming pool question -> grounded amenity answer.
3. Room for 3 guests -> Family Suite is identified.
4. Breakfast question -> package policy is returned.
5. Cancellation question -> policy is returned.
6. Valid availability -> matching rooms returned by deterministic service.
7. Missing availability data -> user is prompted for missing fields.
8. Invalid date range -> validation error.
9. Follow-up question -> conversation context is sent.
10. Unsupported hotel fact -> assistant avoids guessing.
11. LLM failure -> friendly fallback.
12. Backend failure -> frontend displays an error.
13. End-to-end frontend to backend flow.
14. Mobile viewport remains usable.
