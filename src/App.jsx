import { useState, useEffect, useRef } from "react";

const GOOGLE_DOC_URL = "https://docs.google.com/document/d/1YpRDDV1Pn1xGsk4zhgfn1H1HKu7KbU-tcsWNBz_J8Ck/edit?usp=sharing";
const WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/T63fLDPcMSkZuqHIDdrH/webhook-trigger/5d753662-0be3-4868-b526-051ba20ca161";
const BOOKING_URL = "/book";

// --- Design tokens (lynegaard.co) ---
const colors = {
  charcoal: "#1C1917",
  charcoalLight: "#292524",
  surface: "#252120",
  gold: "#D4A574",
  goldLight: "#E4C49A",
  goldSubtle: "rgba(212,165,116,0.15)",
  cream: "#FAFAF9",
  warmGray: "#A8A29E",
  warmGrayDark: "#78716C",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(212,165,116,0.3)",
};

const fonts = {
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
};

// --- Meta Pixel / CAPI helpers ---
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function generateEventId() {
  return "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}

function trackServerEvent({ event_name, email, name, event_id }) {
  const payload = {
    event_name,
    event_id,
    source_url: window.location.href,
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc") || new URLSearchParams(window.location.search).get("fbclid"),
  };
  if (email) payload.email = email;
  if (name) payload.name = name;

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const utm = {};
  for (const key of utmKeys) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return utm;
}

// --- Modal ---
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
        body: JSON.stringify({ name: name.trim(), email: email.trim(), ...getUtmParams() }),
      });
    } catch (err) {}
    onSubmit({ name: name.trim(), email: email.trim() });
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    fontFamily: fonts.sans,
    fontSize: 16,
    border: `1.5px solid ${colors.border}`,
    borderRadius: 8,
    background: colors.surface,
    color: colors.cream,
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(12,10,9,0.7)",
        backdropFilter: "blur(8px)",
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
          background: colors.charcoalLight,
          border: `1px solid ${colors.border}`,
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
          color: colors.warmGrayDark, fontSize: 20, lineHeight: 1, padding: 4,
        }}>&#x2715;</button>

        <p style={{
          fontFamily: fonts.serif,
          fontSize: 24, fontWeight: 700, color: colors.cream,
          margin: "0 0 8px 0", lineHeight: 1.25,
        }}>
          Get pricing & terms
        </p>
        <p style={{
          fontFamily: fonts.sans,
          fontSize: 14, color: colors.warmGray, lineHeight: 1.5,
          margin: "0 0 24px 0",
        }}>
          We'll send you a short Google Doc with pricing, lead volume, and terms for a 10-lead trial. No call required - just the info.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{
              display: "block", fontFamily: fonts.sans,
              fontSize: 13, fontWeight: 500, color: colors.warmGray,
              marginBottom: 6, letterSpacing: "0.02em",
            }}>First name</label>
            <input
              type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John" required style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = colors.gold}
              onBlur={(e) => e.target.style.borderColor = colors.border}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{
              display: "block", fontFamily: fonts.sans,
              fontSize: 13, fontWeight: 500, color: colors.warmGray,
              marginBottom: 6, letterSpacing: "0.02em",
            }}>Email</label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@agency.com" required style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = colors.gold}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "15px 24px",
            fontFamily: fonts.sans,
            fontSize: 16, fontWeight: 600,
            color: colors.charcoal,
            background: loading ? colors.warmGrayDark : colors.gold,
            border: "none", borderRadius: 8,
            cursor: loading ? "default" : "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = colors.goldLight }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = colors.gold }}
          >
            {loading ? "One moment..." : "Send me the details"}
          </button>
        </form>

        <p style={{
          fontFamily: fonts.sans,
          fontSize: 12, color: colors.warmGrayDark,
          marginTop: 12, textAlign: "center",
        }}>No calls. No follow-up pressure. Just the document.</p>
      </div>
    </div>
  );
}

// --- Landing Page ---
function OptInPage({ onSubmit }) {
  const [modalOpen, setModalOpen] = useState(false);

  const bulletStyle = {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 1.6,
    color: colors.warmGray,
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  };

  const checkIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: colors.charcoal,
      padding: "24px",
    }}>
      {/* Subtle noise texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(212,165,116,0.04) 0%, transparent 60%),
                          radial-gradient(ellipse at 80% 20%, rgba(212,165,116,0.03) 0%, transparent 50%)`,
      }} />

      <div style={{ maxWidth: 520, width: "100%", position: "relative", zIndex: 1 }}>

        {/* Availability tag */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: colors.goldSubtle,
          border: `1px solid ${colors.borderHover}`,
          borderRadius: 100,
          padding: "6px 14px",
          marginBottom: 28,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: colors.gold,
            display: "inline-block",
          }} />
          <span style={{
            fontFamily: fonts.sans,
            fontSize: 13, fontWeight: 500, color: colors.gold,
          }}>
            Accepting new agents - limited spots
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: fonts.serif,
          fontSize: "clamp(32px, 6vw, 46px)",
          fontWeight: 700,
          lineHeight: 1.1,
          color: colors.cream,
          margin: "0 0 20px 0",
        }}>
          Exclusive term life leads.
          <br />
          <span style={{ color: colors.warmGrayDark }}>Pay per lead. No retainer.</span>
        </h1>

        {/* Subhead */}
        <p style={{
          fontFamily: fonts.sans,
          fontSize: 17,
          lineHeight: 1.6,
          color: colors.warmGray,
          margin: "0 0 32px 0",
        }}>
          For life insurance agents who can pick up the phone and close. Not shared leads. Not aged leads. Fresh, exclusive, yours only.
        </p>

        {/* Bullets */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginBottom: 36,
        }}>
          <div style={bulletStyle}>{checkIcon} <span><strong style={{ color: colors.cream, fontWeight: 600 }}>Pay per lead</strong> - no retainers, no ad spend, no monthly fees</span></div>
          <div style={bulletStyle}>{checkIcon} <span><strong style={{ color: colors.cream, fontWeight: 600 }}>100% exclusive</strong> - every lead goes to one agent only</span></div>
          <div style={bulletStyle}>{checkIcon} <span><strong style={{ color: colors.cream, fontWeight: 600 }}>Capped volume</strong> - limited leads per area to protect quality</span></div>
          <div style={bulletStyle}>{checkIcon} <span><strong style={{ color: colors.cream, fontWeight: 600 }}>48-hour delivery</strong> - start receiving leads within two days</span></div>
          <div style={bulletStyle}>{checkIcon} <span><strong style={{ color: colors.cream, fontWeight: 600 }}>Money-back guarantee</strong> - test 10 leads risk-free</span></div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setModalOpen(true)}
          style={{
            width: "100%",
            padding: "18px 24px",
            fontFamily: fonts.sans,
            fontSize: 17,
            fontWeight: 600,
            color: colors.charcoal,
            background: colors.gold,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.2s",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => e.target.style.background = colors.goldLight}
          onMouseLeave={(e) => e.target.style.background = colors.gold}
        >
          See pricing & terms
        </button>

        {/* Qualifier line */}
        <p style={{
          fontFamily: fonts.sans,
          fontSize: 13,
          color: colors.warmGrayDark,
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

// --- Booking Page ---
function BookingPage() {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Load GHL form embed script
    if (!document.querySelector('script[src*="form_embed"]')) {
      const script = document.createElement("script");
      script.src = "https://link.msgsndr.com/js/form_embed.js";
      script.type = "text/javascript";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: colors.charcoal,
      padding: "40px 24px 24px",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(212,165,116,0.05) 0%, transparent 60%)`,
      }} />

      <div style={{ maxWidth: 600, width: "100%", position: "relative", zIndex: 1 }}>
        {/* Back link */}
        <a href="/"
          style={{
            fontFamily: fonts.sans,
            fontSize: 14, color: colors.warmGrayDark,
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
            marginBottom: 28, transition: "color 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = colors.warmGray}
          onMouseLeave={(e) => e.currentTarget.style.color = colors.warmGrayDark}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </a>

        <h1 style={{
          fontFamily: fonts.serif,
          fontSize: "clamp(24px, 4vw, 32px)",
          fontWeight: 700, lineHeight: 1.2, color: colors.cream,
          margin: "0 0 8px 0",
        }}>
          Book a 15-min intro call
        </h1>

        <p style={{
          fontFamily: fonts.sans,
          fontSize: 15, lineHeight: 1.6, color: colors.warmGray,
          margin: "0 0 28px 0",
        }}>
          Pick a time that works for you. We'll confirm your area, discuss volume, and answer any questions.
        </p>

        {/* GHL Calendar Embed */}
        <div style={{
          background: colors.charcoalLight,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          overflow: "hidden",
          minHeight: 600,
        }}>
          <iframe
            ref={iframeRef}
            src="https://api.leadconnectorhq.com/widget/booking/u27q4eHgWZuMke5hvBKe"
            style={{ width: "100%", border: "none", overflow: "hidden", minHeight: 600 }}
            scrolling="no"
            id="pplus-booking-embed"
          />
        </div>

        <p style={{
          fontFamily: fonts.sans,
          fontSize: 13, color: colors.warmGrayDark, marginTop: 20,
          textAlign: "center",
        }}>
          All times shown in your local timezone.
        </p>
      </div>
    </div>
  );
}

// --- Thank You Page ---
function ThankYouPage({ name }) {
  const firstName = name ? name.split(" ")[0] : "";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: colors.charcoal,
      padding: "24px",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `radial-gradient(ellipse at 30% 40%, rgba(212,165,116,0.05) 0%, transparent 60%)`,
      }} />

      <div style={{ maxWidth: 520, width: "100%", position: "relative", zIndex: 1 }}>

        {/* Check icon */}
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: colors.goldSubtle,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: fonts.serif,
          fontSize: "clamp(28px, 5vw, 38px)",
          fontWeight: 700, lineHeight: 1.2, color: colors.cream,
          margin: "0 0 20px 0",
        }}>
          {firstName ? `Got it, ${firstName}.` : "Got it."}
        </h1>

        {/* Description */}
        <p style={{
          fontFamily: fonts.sans,
          fontSize: 17, lineHeight: 1.65, color: colors.warmGray,
          margin: "0 0 12px 0",
        }}>
          I'm sending you a document with the full breakdown - how leads are generated, pricing, volume availability for your area, and how to start a risk-free 10-lead trial.
        </p>

        <p style={{
          fontFamily: fonts.sans,
          fontSize: 17, lineHeight: 1.65, color: colors.warmGray,
          margin: "0 0 32px 0",
        }}>
          In the meantime - let's find a time to talk.
        </p>

        {/* Primary CTA: Book a call */}
        <a href={BOOKING_URL}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", padding: "16px 24px",
            fontFamily: fonts.sans,
            fontSize: 16, fontWeight: 600,
            color: colors.charcoal,
            background: colors.gold,
            border: "none", borderRadius: 8,
            cursor: "pointer", textDecoration: "none",
            transition: "all 0.2s", letterSpacing: "0.01em", boxSizing: "border-box",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = colors.goldLight}
          onMouseLeave={(e) => e.currentTarget.style.background = colors.gold}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Book a 15-min intro call
        </a>

        {/* Secondary CTA: Google Doc */}
        <a href={GOOGLE_DOC_URL} target="_blank" rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", padding: "14px 24px",
            fontFamily: fonts.sans,
            fontSize: 15, fontWeight: 500,
            color: colors.gold,
            background: "transparent",
            border: `1px solid ${colors.borderHover}`,
            borderRadius: 8,
            cursor: "pointer", textDecoration: "none",
            transition: "all 0.2s", letterSpacing: "0.01em", boxSizing: "border-box",
            marginTop: 12,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.gold;
            e.currentTarget.style.background = "rgba(212,165,116,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.borderHover;
            e.currentTarget.style.background = "transparent";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Read the full breakdown
        </a>

        {/* Info box */}
        <div style={{
          marginTop: 32, padding: "20px 24px",
          background: colors.charcoalLight,
          border: `1px solid ${colors.border}`,
          borderRadius: 10,
        }}>
          <p style={{
            fontFamily: fonts.sans,
            fontSize: 14, fontWeight: 600, color: colors.cream,
            margin: "0 0 8px 0",
          }}>What happens next?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{
              fontFamily: fonts.sans,
              fontSize: 14, lineHeight: 1.6, color: colors.warmGray, margin: 0,
              display: "flex", alignItems: "flex-start", gap: 8,
            }}>
              <span style={{ color: colors.gold, fontWeight: 600, flexShrink: 0 }}>1.</span>
              Check your email for the pricing document
            </p>
            <p style={{
              fontFamily: fonts.sans,
              fontSize: 14, lineHeight: 1.6, color: colors.warmGray, margin: 0,
              display: "flex", alignItems: "flex-start", gap: 8,
            }}>
              <span style={{ color: colors.gold, fontWeight: 600, flexShrink: 0 }}>2.</span>
              Book a quick call so we can confirm your area and volume
            </p>
            <p style={{
              fontFamily: fonts.sans,
              fontSize: 14, lineHeight: 1.6, color: colors.warmGray, margin: 0,
              display: "flex", alignItems: "flex-start", gap: 8,
            }}>
              <span style={{ color: colors.gold, fontWeight: 600, flexShrink: 0 }}>3.</span>
              Start receiving leads within 48 hours
            </p>
          </div>
        </div>

        <p style={{
          fontFamily: fonts.sans,
          fontSize: 13, color: colors.warmGrayDark, marginTop: 28,
        }}>
          Document also sent to your email for reference.
        </p>
      </div>
    </div>
  );
}

// --- App ---
export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState({ name: "" });
  const serverPageViewSent = useRef(false);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    // Load Google Fonts (Playfair Display + Inter)
    if (!document.querySelector('link[href*="Playfair+Display"]')) {
      const link = document.createElement("link");
      link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;700&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    // Send server-side PageView (pixel client-side PageView fires from index.html)
    if (!serverPageViewSent.current) {
      serverPageViewSent.current = true;
      trackServerEvent({ event_name: "PageView", event_id: generateEventId() });
    }

    // Listen for popstate (browser back/forward)
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSubmit = (data) => {
    setUserData(data);
    setSubmitted(true);

    // Fire Lead event - both client-side pixel and server-side CAPI
    const leadEventId = generateEventId();
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", {}, { eventID: leadEventId });
    }
    trackServerEvent({
      event_name: "Lead",
      email: data.email,
      name: data.name,
      event_id: leadEventId,
    });
  };

  // Simple path routing
  if (path === "/book") return <BookingPage />;
  if (submitted) return <ThankYouPage name={userData.name} />;
  return <OptInPage onSubmit={handleSubmit} />;
}
