import React from "react";
import { Bot, User } from "lucide-react";

export default function MessageBubble({ role, content }) {
  const a = role === "assistant";

  return (
    <div className={`message-row ${a ? "assistant-row" : "user-row"}`}>
      <div className={`avatar ${a ? "assistant-avatar" : "user-avatar"}`}>
        {a ? "M" : "You"}
      </div>

      <div
        className={`message-bubble ${
          a ? "assistant-bubble" : "user-bubble"
        }`}
      >
        {content}
      </div>
    </div>
  );
}