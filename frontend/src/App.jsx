import React from "react";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Menu,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import MessageBubble from "./components/MessageBubble";
import AvailabilityForm from "./components/AvailabilityForm";
import RoomCard from "./components/RoomCard";
import { checkAvailability, sendChat } from "./services/api";

const welcome = {
  role: "assistant",
  content:
    "Welcome to The Meridian House. I can help with rooms, amenities, breakfast, hotel policies, and availability. What can I help you with?",
};

const suggestions = [
  "What time is check-in?",
  "Does the hotel have a swimming pool?",
  "Which room is suitable for three guests?",
  "Is breakfast included?",
];

export default function App() {
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(false);

  const conversation = useMemo(
    () =>
      messages.map(({ role, content }) => ({
        role,
        content,
      })),
    [messages]
  );

  // -----------------------------
  // Guest Assistant
  // -----------------------------
  async function send(text = input) {
    text = text.trim();

    if (!text || sending) return;

    setInput("");
    setError("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: text,
      },
    ]);

    setSending(true);

    try {
      const data = await sendChat(text, conversation);

      /*
        Backend response:
        {
          message: {
            answer: "...",
            fallback: false
          }
        }

        We display only the answer text.
      */

      const answer =
        typeof data?.message === "string"
          ? data.message
          : data?.message?.answer;

      if (!answer) {
        throw new Error("The assistant returned an invalid response.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (e) {
      setError(
        e?.message ||
          "I'm sorry, something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  // -----------------------------
  // Availability Search
  // -----------------------------
  async function search(payload) {
    setError("");
    setAvailability(null);
    setLoading(true);

    try {
      const result = await checkAvailability(payload);

      /*
        Availability results are displayed ONLY
        in the availability section.

        They are intentionally NOT added to
        the guest-assistant conversation.
      */

      setAvailability(result);
    } catch (e) {
      setError(
        e?.message ||
          "We couldn't check availability right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      {/* =========================
          HEADER
      ========================== */}
      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark">MH</span>

          <span>
            <strong>THE MERIDIAN</strong>
            <small>HOUSE</small>
          </span>
        </a>

        <nav className={menu ? "nav mobile-open" : "nav"}>
          <a href="#stay" onClick={() => setMenu(false)}>
            Stay
          </a>

          <a href="#rooms" onClick={() => setMenu(false)}>
            Rooms
          </a>

          <a href="#amenities" onClick={() => setMenu(false)}>
            Amenities
          </a>

          <a href="#assistant" onClick={() => setMenu(false)}>
            Guest Assistant
          </a>
        </nav>

        <a className="header-action" href="#availability">
          Check availability
          <ArrowRight size={16} />
        </a>

        <button
          className="menu-button"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle navigation"
        >
          {menu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        {/* =========================
            HERO
        ========================== */}
        <section className="hero" id="stay">
          <div className="hero-content">
            <span className="hero-kicker">
              A CITY HOTEL, MADE PERSONAL
            </span>

            <h1>
              Your stay,
              <br />
              <em>simply taken care of.</em>
            </h1>

            <p>
              Ask our guest assistant about your stay, discover the
              right room, or check availability in moments.
            </p>

            <a className="hero-button" href="#assistant">
              Meet your guest assistant
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="hero-location">
            BENGALURU · KARNATAKA
          </div>
        </section>

        {/* =========================
            INTRO STRIP
        ========================== */}
        <section className="intro-strip">
          <div>
            <span>01</span>
            <strong>Thoughtful rooms</strong>
          </div>

          <div>
            <span>02</span>
            <strong>Personal service</strong>
          </div>

          <div>
            <span>03</span>
            <strong>Seamless stays</strong>
          </div>
        </section>

        {/* =========================
            GUEST ASSISTANT
        ========================== */}
        <section className="assistant-section" id="assistant">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                YOUR DIGITAL CONCIERGE
              </span>

              <h2>How may we help?</h2>
            </div>

            <p>
              Ask a question naturally. Our assistant can help with
              hotel information, rooms, policies, amenities and
              availability.
            </p>
          </div>

          <div className="assistant-layout">
            {/* Assistant Sidebar */}
            <aside className="assistant-side">
              <div className="concierge-card">
                <div className="concierge-icon">
                  <Bot size={23} />
                </div>

                <span className="eyebrow">
                  MERIDIAN ASSIST
                </span>

                <h3>Here for the details.</h3>

                <p>
                  From check-in times to finding the right room,
                  get quick answers before and during your stay.
                </p>
              </div>

              <div className="quick-questions">
                <span className="eyebrow">
                  POPULAR QUESTIONS
                </span>

                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => send(suggestion)}
                    disabled={sending}
                  >
                    {suggestion}

                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </aside>

            {/* Chat */}
            <div className="chat-card">
              <div className="chat-header">
                <div className="assistant-status">
                  <span className="status-dot" />

                  <div>
                    <strong>
                      Meridian Guest Assistant
                    </strong>

                    <small>
                      Online · Ready to help
                    </small>
                  </div>
                </div>

                <Sparkles size={18} />
              </div>

              <div className="messages">
                {messages.map((message, index) => (
                  <MessageBubble
                    key={index}
                    {...message}
                  />
                ))}

                {sending && (
                  <div className="message-row assistant-row">
                    <div className="avatar assistant-avatar">
                      M
                    </div>

                    <div className="message-bubble assistant-bubble typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="inline-error">
                  <span>{error}</span>

                  <button onClick={() => setError("")}>
                    Dismiss
                  </button>
                </div>
              )}

              <form
                className="chat-input"
                onSubmit={(event) => {
                  event.preventDefault();
                  send();
                }}
              >
                <input
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  placeholder="Ask anything about your stay..."
                  disabled={sending}
                />

                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* =========================
            AVAILABILITY
        ========================== */}
        <section
          className="availability-section"
          id="availability"
        >
          <div className="availability-copy">
            <span className="eyebrow">
              PLAN YOUR STAY
            </span>

            <h2>
              Find the room
              <br />
              <em>that fits.</em>
            </h2>

            <p>
              Tell us when you're arriving and how many guests are
              travelling. We'll show the available room options.
            </p>
          </div>

          <div className="availability-panel">
            <AvailabilityForm
              onSearch={search}
              loading={loading}
            />

            {availability && (
              <div className="results">
                <div className="results-header">
                  <div>
                    <span className="eyebrow">
                      YOUR RESULTS
                    </span>

                    <h3>
                      {availability.available
                        ? "Rooms available for your stay"
                        : "No matching rooms found"}
                    </h3>
                  </div>

                  <span>
                    {availability.nights} nights
                  </span>
                </div>

                {availability.available ? (
                  availability.rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                    />
                  ))
                ) : (
                  <div className="no-results">
                    We couldn't find a room for{" "}
                    {availability.adults} guests on those
                    dates. Try different dates or a different
                    guest count.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* =========================
            AMENITIES
        ========================== */}
        <section
          className="amenities-section"
          id="amenities"
        >
          <span className="eyebrow">
            THE MERIDIAN HOUSE
          </span>

          <h2>
            Everything you need,
            <br />
            <em>nothing you don't.</em>
          </h2>

          <div className="amenity-grid">
            <div>
              <span>01</span>

              <h3>Outdoor Pool</h3>

              <p>
                A quiet place to unwind after a day in the city.
              </p>
            </div>

            <div>
              <span>02</span>

              <h3>Fitness Centre</h3>

              <p>
                Open daily from 6:00 AM to 10:00 PM.
              </p>
            </div>

            <div>
              <span>03</span>

              <h3>Complimentary Wi-Fi</h3>

              <p>
                Stay connected throughout the hotel.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer>
        <div className="footer-brand">
          THE MERIDIAN HOUSE
        </div>

        <div>BENGALURU · KARNATAKA</div>

        <div>GUEST ASSISTANT</div>
      </footer>
    </div>
  );
}