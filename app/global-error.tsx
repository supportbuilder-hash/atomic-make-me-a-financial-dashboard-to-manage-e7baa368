"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div data-atomic-error="1" data-atomic-error-message={String(error?.message ?? "")} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ textAlign: "center", maxWidth: "30rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚠️</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Something went wrong</h2>
            {/* Replaces the root layout, so globals.css tokens aren't loaded: literal colors. */}
            <p style={{ color: "rgb(107 114 128)", marginBottom: "1.5rem" }}>The app hit an unexpected error.</p>
            <button
              onClick={() => reset()}
              style={{ background: "rgb(124 58 237)", color: "white", fontWeight: 600, padding: "0.6rem 1.25rem", borderRadius: "0.6rem", border: "none", cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
