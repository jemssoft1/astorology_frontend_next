"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NoAccessPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate modal in
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at center, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        zIndex: 9999,
        padding: "1rem",
      }}
    >
      {/* Subtle animated gradient orbs */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)",
          top: "10%",
          left: "5%",
          animation: "pulse 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          bottom: "15%",
          right: "8%",
          animation: "pulse 5s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "24px",
          padding: "3rem 2.5rem",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow:
            "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
          transform: visible
            ? "scale(1) translateY(0)"
            : "scale(0.92) translateY(20px)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
        }}
      >
        {/* Lock Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: "0 0 32px rgba(251,146,60,0.4)",
            fontSize: "2rem",
          }}
        >
          🔒
        </div>

        {/* Heading */}
        <h1
          style={{
            color: "#fff",
            fontSize: "1.75rem",
            fontWeight: 700,
            margin: "0 0 0.75rem",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Access Restricted
        </h1>

        {/* Sub-heading */}
        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            margin: "0 0 2rem",
          }}
        >
          आपके पास इस dashboard को access करने की अनुमति नहीं है।
          <br />
          <span
            style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}
          >
            You need a valid access token to view this page.
          </span>
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.08)",
            margin: "0 0 1.75rem",
          }}
        />

        {/* Info Box */}
        <div
          style={{
            background: "rgba(251,146,60,0.08)",
            border: "1px solid rgba(251,146,60,0.2)",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "1.75rem",
            textAlign: "left",
          }}
        >
          <p
            style={{
              color: "rgba(251,146,60,0.9)",
              fontSize: "0.82rem",
              fontWeight: 600,
              margin: "0 0 0.3rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            ⚠️ No Session Found
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.83rem",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Please login from the main portal to get redirected here
            automatically with a valid token.
            {from !== "/" && (
              <span
                style={{ display: "block", marginTop: "0.4rem", opacity: 0.6 }}
              >
                Tried to access:{" "}
                <code
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    padding: "1px 6px",
                    borderRadius: "4px",
                    fontSize: "0.78rem",
                    color: "#a5b4fc",
                  }}
                >
                  {from}
                </code>
              </span>
            )}
          </p>
        </div>

        {/* Contact info */}
        <p
          style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.78rem",
            margin: 0,
          }}
        >
          अगर यह गलती है तो अपने admin से संपर्क करें।
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
