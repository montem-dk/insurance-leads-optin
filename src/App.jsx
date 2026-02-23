import { useState, useEffect } from "react";

const GOOGLE_DOC_URL = "https://docs.google.com/document/d/1RwOKuApkszB6ymPZlLFOCJqDlblILH1kGebeVUQV_vE/edit?usp=sharing";
const WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/T63fLDPcMSkZuqHIDdrH/webhook-trigger/5d753662-0be3-4868-b526-051ba20ca161";

function Modal({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
    } catch (err) {}
    onSubmit({ name: name.trim(), email: email.trim() });
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 16,
    border: "1.5px solid #D4D2CC",
    borderRadius: 8,
    background: "#fff",
    color: "#1A1A18",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(20,20,18,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 24,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "32px 28px",
          maxWidth: 420,
          width: "100%",
          position: "relative",
          animation: "slideUp 0.25s ease",
        }}
      >
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "none", border: "none", cursor: "pointer",
          color: "#94918A", fontSize: 20, lineHeight: 1, padding: 4,
        }}>✕</button>

        <p style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 24, fontWeight: 400, color: "#1A1A18",
          margin: "0 0 8px 0", lineHeight: 1.25,
        }}>
          Check availability
        </p>
        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 14, color: "#6B6960", lineHeight: 1.5,
          margin: "0 0 24px 0",
        }}>
          Enter your details and I'll send over pricing, volume, and how to start a 10-lead trial.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{
              display: "block", fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 13, fontWeight: 500, color: "#1A1A18",
              marginBottom: 6, letterSpacing: "0.02em",
            }}>First name</label>
            <input
              type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John" required style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#1A1A18"}
              onBlur={(e) => e.target.style.borderColor = "#D4D2CC"}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{
              display: "block", fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 13, fontWeight: 500, color: "#1A1A18",
              marginBottom: 6, letterSpacing: "0.02em",
            }}>Email</label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com" required style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#1A1A18"}
              onBlur={(e) => e.target.style.borderColor = "#D4D2CC"}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "15px 24px",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 16, fontWeight: 600, color: "#fff",
            background: loading ? "#94918A" : "#1A1A18",
            border: "none", borderRadius: 8,
            cursor: loading ? "default" : "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = "#333330" }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = "#1A1A18" }}
          >
            {loading ? "One moment..." : "Check availability →"}
          </button>
        </form>

        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 12, color: "#94918A",
          marginTop: 12, textAlign: "center",
        }}>No sales call. Details sent instantly.</p>
      </div>
    </div>
  );
}

function OptInPage({ onSubmit }) {
  const [modalOpen, setModalOpen] = useState(false);

  const bulletStyle = {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 16,
    lineHeight: 1.5,
    color: "#3A3935",
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  };

  const checkIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D8C2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#FAFAF8",
      padding: "24px",
    }}>
      <div style={{ maxWidth: 520, width: "100%" }}>

        {/* Availability tag */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#EEFBEE",
          border: "1px solid #C8E6C8",
          borderRadius: 100,
          padding: "6px 14px",
          marginBottom: 24,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#2D8C2D",
            display: "inline-block",
          }} />
          <span style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 13, fontWeight: 500, color: "#2D6B2D",
          }}>
            Accepting new agents — limited spots
          </span>
        </div>

        {/* Headline — transactional */}
        <h1 style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: "clamp(32px, 6vw, 46px)",
          fontWeight: 400,
          lineHeight: 1.15,
          color: "#1A1A18",
          margin: "0 0 16px 0",
        }}>
          Exclusive life insurance leads.
          <br />
          <span style={{ color: "#94918A" }}>Pay per lead. No retainer.</span>
        </h1>

        {/* Subhead — expectation setter */}
        <p style={{
          fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
          fontSize: 17,
          lineHeight: 1.6,
          color: "#52504A",
          margin: "0 0 28px 0",
        }}>
          For established life insurance agents who can pick up the phone and close. Not shared leads. Not aged leads. Fresh, exclusive, yours only.
        </p>

        {/* Bullets — transactional, scannable */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 32,
        }}>
          <div style={bulletStyle}>{checkIcon} <span><strong style={{ color: "#1A1A18", fontWeight: 600 }}>Pay per lead</strong> — no retainers, no ad spend, no monthly commitment</span></div>
          <div style={bulletStyle}>{checkIcon} <span><strong style={{ color: "#1A1A18", fontWeight: 600 }}>100% exclusive</strong> — every lead goes to one agent only</span></div>
          <div style={bulletStyle}>{checkIcon} <span><strong style={{ color: "#1A1A18", fontWeight: 600 }}>Capped volume</strong> — limited leads per area to protect quality</span></div>
          <div style={bulletStyle}>{checkIcon} <span><strong style={{ color: "#1A1A18", fontWeight: 600 }}>48-hour delivery</strong> — start receiving leads within two days</span></div>
          <div style={bulletStyle}>{checkIcon} <span><strong style={{ color: "#1A1A18", fontWeight: 600 }}>Money-back guarantee</strong> — test 10 leads risk-free</span></div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setModalOpen(true)}
          style={{
            width: "100%",
            padding: "18px 24px",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 17,
            fontWeight: 600,
            color: "#fff",
            background: "#1A1A18",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.2s",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => e.target.style.background = "#333330"}
          onMouseLeave={(e) => e.target.style.background = "#1A1A18"}
        >
          Check availability →
        </button>

        {/* Not-for line */}
        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 13,
          color: "#94918A",
          marginTop: 16,
          textAlign: "center",
        }}>
          Best for agents doing $10k+ AP/month who want consistent deal flow.
        </p>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function ThankYouPage({ name }) {
  const firstName = name ? name.split(" ")[0] : "";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#FAFAF8",
      padding: "24px",
    }}>
      <div style={{ maxWidth: 520, width: "100%" }}>

        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "#E8F5E8",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D8C2D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: "clamp(28px, 5vw, 38px)",
          fontWeight: 400, lineHeight: 1.2, color: "#1A1A18",
          margin: "0 0 20px 0",
        }}>
          {firstName ? `Got it, ${firstName}.` : "Got it."}
        </h1>

        <p style={{
          fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
          fontSize: 17, lineHeight: 1.65, color: "#52504A",
          margin: "0 0 12px 0",
        }}>
          Here's the full breakdown — how leads are generated, pricing per lead, volume availability for your area, and how to start a risk-free 10-lead trial.
        </p>

        <p style={{
          fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
          fontSize: 17, lineHeight: 1.65, color: "#52504A",
          margin: "0 0 32px 0",
        }}>
          3-minute read. Straight to the point.
        </p>

        <a href={GOOGLE_DOC_URL} target="_blank" rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            width: "100%", padding: "16px 24px",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 16, fontWeight: 600, color: "#fff",
            background: "#1A1A18", border: "none", borderRadius: 8,
            cursor: "pointer", textDecoration: "none",
            transition: "all 0.2s", letterSpacing: "0.01em", boxSizing: "border-box",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#333330"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#1A1A18"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          See pricing & availability →
        </a>

        <div style={{
          marginTop: 36, padding: "20px 24px",
          background: "#F3F2EE", borderRadius: 10,
        }}>
          <p style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 14, fontWeight: 600, color: "#1A1A18",
            margin: "0 0 8px 0",
          }}>Ready to start?</p>
          <p style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 14, lineHeight: 1.6, color: "#52504A", margin: 0,
          }}>
            There's a WhatsApp link at the bottom of the document. Message me your area and volume — I'll confirm availability and get your first 10 leads delivered within 48 hours.
          </p>
        </div>

        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 13, color: "#94918A", marginTop: 32,
        }}>
          Also sent to your email for reference.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState({ name: "" });

  if (typeof document !== "undefined") {
    const existing = document.querySelector('link[href*="Instrument+Serif"]');
    if (!existing) {
      const link = document.createElement("link");
      link.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Instrument+Serif&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }

  if (submitted) return <ThankYouPage name={userData.name} />;
  return <OptInPage onSubmit={(data) => { setUserData(data); setSubmitted(true); }} />;
}
