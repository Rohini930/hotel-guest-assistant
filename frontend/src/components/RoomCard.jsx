import React from "react";
import { Users, Moon } from "lucide-react";

export default function RoomCard({ room }) {
  return (
    <article className="room-card">
      <div className="room-image">
        <div className="room-image-overlay">THE MERIDIAN HOUSE</div>
      </div>

      <div className="room-content">
        <div className="room-heading">
          <div>
            <span className="eyebrow">AVAILABLE ROOM</span>
            <h3>{room.name}</h3>
          </div>

          <div className="room-price">
            <strong>₹{room.nightly_rate.toLocaleString("en-IN")}</strong>
            <span>/ night</span>
          </div>
        </div>

        <p>{room.description}</p>

        <div className="room-meta">
          <span>
            <Users size={15} /> Up to {room.capacity} guests
          </span>

          <span>
            <Moon size={15} /> {room.nights} nights
          </span>
        </div>

        <div className="room-total">
          Total stay <strong>₹{room.total.toLocaleString("en-IN")}</strong>
        </div>
      </div>
    </article>
  );
}