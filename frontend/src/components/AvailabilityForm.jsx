import React from "react";
import { useState } from "react";
import { CalendarDays, Users, Search } from "lucide-react";

export default function AvailabilityForm({ onSearch, loading }) {
  const today = new Date().toISOString().slice(0, 10);
  const [ci, setCi] = useState("");
  const [co, setCo] = useState("");
  const [ad, setAd] = useState(2);

  return (
    <form
      className="availability-form"
      onSubmit={e => {
        e.preventDefault();
        onSearch({
          check_in: ci,
          check_out: co,
          adults: Number(ad)
        });
      }}
    >
      <div className="field">
        <label>
          <CalendarDays size={15} /> Check-in
        </label>
        <input
          type="date"
          min={today}
          value={ci}
          onChange={e => setCi(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label>
          <CalendarDays size={15} /> Check-out
        </label>
        <input
          type="date"
          min={ci || today}
          value={co}
          onChange={e => setCo(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label>
          <Users size={15} /> Guests
        </label>
        <select value={ad} onChange={e => setAd(e.target.value)}>
          {[1, 2, 3, 4].map(n => (
            <option key={n} value={n}>
              {n} {n === 1 ? "Guest" : "Guests"}
            </option>
          ))}
        </select>
      </div>

      <button className="availability-button" disabled={loading}>
        <Search size={17} />
        {loading ? "Checking..." : "Check availability"}
      </button>
    </form>
  );
}