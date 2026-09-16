import os
import json
from dotenv import load_dotenv
from google import genai

from .data import load_hotel_data

load_dotenv(override=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


def generate_ai_response(question, conversation_context=None):
    """
    Generate a natural-language response using Gemini.

    The hotel knowledge base is supplied to the model so that
    responses stay grounded in the hotel's actual information.
    """

    if not client:
        return {
            "answer": (
                "I'm sorry, the AI service is currently unavailable. "
                "Please try again shortly."
            ),
            "fallback": True
        }

    hotel_context = json.dumps(load_hotel_data(), indent=2)

    previous_messages = conversation_context or []

    prompt = f"""
You are the guest assistant for The Meridian House, Bengaluru.

Your job is to help hotel guests with questions about:
- rooms
- amenities
- check-in and check-out
- breakfast
- cancellation policies
- children and pets
- other hotel FAQs

IMPORTANT RULES:
1. Answer only using the hotel information provided below.
2. Do not invent hotel policies, facilities, prices, availability, or services.
3. If the information is not available, clearly say that you don't have
   that information and suggest contacting the hotel.
4. Keep answers friendly, concise, and useful.
5. Use previous conversation context when it helps answer follow-up questions.
6. Do NOT make room availability decisions. Availability is handled
   separately by the backend.

HOTEL KNOWLEDGE BASE:
{hotel_context}

PREVIOUS CONVERSATION:
{previous_messages}

GUEST QUESTION:
{question}

Provide a natural response directly to the guest.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt
        )

        answer = response.text.strip()

        return {
            "answer": answer,
            "fallback": False
        }

    except Exception as error:
        print(f"Gemini API error: {error}")

        return {
            "answer": (
                "I'm sorry, I'm having trouble processing that right now. "
                "Please try again in a moment."
            ),
            "fallback": True
        }
generate_response = generate_ai_response