import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [personality, setPersonality] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = [
    "#a855f7","#ec4899","#fbbf24","#34d399","#60a5fa",
    "#f97316","#14b8a6","#e879f9","#84cc16","#fb7185"
  ];
  const color = colors[(parseInt(id) - 1) % colors.length];

  useEffect(() => {
    fetch("/api/personalities")
      .then(res => res.json())
      .then(data => setPersonality(data.find(p => p.id === parseInt(id))));
  }, [id]);

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personality_id: parseInt(id), messages: newMessages })
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
  }

  if (!personality) return <div style={{ padding: "2rem", fontFamily: "'Fredoka One', cursive", fontSize: "2rem", color: "#a855f7" }}>Loading... 🌀</div>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        background: color,
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        boxShadow: `0 4px 20px ${color}66`
      }}>
        <button
          onClick={() => navigate("/")}
          style={{ background: "white", border: "none", borderRadius: "50%", width: "40px", height: "40px", fontSize: "1.2rem", cursor: "pointer" }}
        >←</button>
        <img
          src={`/src/assets/${personality.image}`}
          alt={personality.name}
          style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", border: "3px solid white" }}
        />
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.8rem", color: "white" }}>
          {personality.name}
        </h1>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "3rem", color: "var(--muted)" }}>
            <div style={{ fontSize: "3rem" }}>👋</div>
            <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.3rem", marginTop: "0.5rem" }}>
              Say hello to {personality.name}!
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "65%",
              padding: "0.85rem 1.25rem",
              borderRadius: m.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
              background: m.role === "user" ? color : "white",
              color: m.role === "user" ? "white" : "var(--text)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              fontWeight: 600,
              lineHeight: 1.5,
              border: m.role === "user" ? "none" : `2px solid ${color}33`
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "0.85rem 1.25rem",
              borderRadius: "20px 20px 20px 4px",
              background: "white",
              border: `2px solid ${color}33`,
              fontWeight: 700,
              color: color
            }}>typing... ✨</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: "1rem 1.5rem",
        background: "white",
        borderTop: `3px solid ${color}33`,
        display: "flex",
        gap: "0.75rem"
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder={`Message ${personality.name}...`}
          style={{
            flex: 1,
            padding: "0.85rem 1.25rem",
            borderRadius: "50px",
            border: `2px solid ${color}`,
            fontFamily: "'Nunito', sans-serif",
            fontSize: "1rem",
            fontWeight: 600,
            outline: "none",
            color: "var(--text)"
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            background: color,
            color: "white",
            border: "none",
            borderRadius: "50px",
            padding: "0.85rem 1.75rem",
            fontFamily: "'Fredoka One', cursive",
            fontSize: "1.1rem",
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "opacity 0.2s"
          }}
        >Send 🚀</button>
      </div>
    </div>
  );
}