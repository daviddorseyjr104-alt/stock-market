"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#05060a",
          color: "#f5f7fb",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "0 1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Campus Capital hit an unexpected error.
        </h1>
        <p style={{ color: "rgba(245,247,251,0.55)", marginTop: "0.5rem" }}>
          {error.message || "Please reload to continue."}
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "1rem",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            background: "linear-gradient(135deg,#39f5ac,#7c5cff)",
            color: "#05060a",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
