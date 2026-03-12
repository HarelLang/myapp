import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [personalities, setPersonalities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/personalities")
      .then(res => res.json())
      .then(data => setPersonalities(data));
  }, []);

  const colors = [
    "#a855f7", "#ec4899", "#fbbf24", "#34d399", "#60a5fa",
    "#f97316", "#14b8a6", "#e879f9", "#84cc16", "#fb7185"
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: "3.5rem",
          background: "linear-gradient(135deg, #1d1b20, #ec4899, #fbbf24)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          ⚔MEDAGDEGIM CHAT⚔
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.2rem", marginTop: "0.5rem", fontWeight: 600 }}>
          CHOSE A MEDAGDEG!
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "1.5rem",
        maxWidth: "1100px",
        margin: "0 auto"
      }}>
        {personalities.map((p, i) => (
          <div
            key={p.id}
            onClick={() => navigate(`/chat/${p.id}`)}
            style={{
              cursor: "pointer",
              borderRadius: "var(--radius)",
              overflow: "hidden",
              border: `3px solid ${colors[i % colors.length]}`,
              boxShadow: `0 8px 24px ${colors[i % colors.length]}44`,
              transition: "transform 0.2s, box-shadow 0.2s",
              background: "white"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
              e.currentTarget.style.boxShadow = `0 16px 40px ${colors[i % colors.length]}88`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${colors[i % colors.length]}44`;
            }}
          >
            <img
              src={`/src/assets/${p.image}`}
              alt={p.name}
              style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
            />
            <div style={{
              padding: "0.75rem",
              background: colors[i % colors.length],
              textAlign: "center"
            }}>
              <p style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.1rem",
                color: "white",
                letterSpacing: "0.5px"
              }}>{p.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}