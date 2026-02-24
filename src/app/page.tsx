"use client";

import { useState, useEffect, useCallback } from "react";

interface Credential {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string | null>(null);

  const fetchCredentials = useCallback(async () => {
    try {
      const res = await fetch("/api/credentials");
      const data = await res.json();
      if (data.credentials) {
        setCredentials(data.credentials);
      }
    } catch {
      console.error("Failed to fetch credentials");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, value }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to store credential");
      } else {
        setSuccess(`Credential "${name}" stored`);
        setName("");
        setValue("");
        fetchCredentials();
      }
    } catch {
      setError("Failed to store credential");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (credName: string) => {
    setDeletingName(credName);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/credentials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: credName }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to delete credential");
      } else {
        setSuccess(`Credential "${credName}" deleted`);
        fetchCredentials();
      }
    } catch {
      setError("Failed to delete credential");
    } finally {
      setDeletingName(null);
    }
  };

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "64px 24px 48px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--blue)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Credentials
          </h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>
          Store encrypted credentials for your Simplex workflows. The agent uses{" "}
          <code
            style={{
              fontFamily: "var(--font-mono)",
              backgroundColor: "var(--blue-bg)",
              color: "var(--blue)",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 12.5,
            }}
          >
            type_secret()
          </code>{" "}
          to securely type them into web forms.
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div
          style={{
            padding: "10px 14px",
            backgroundColor: "var(--red-bg)",
            border: "1px solid var(--red-border)",
            borderRadius: "var(--radius-sm)",
            marginBottom: 16,
            fontSize: 13,
            color: "var(--red)",
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: "10px 14px",
            backgroundColor: "var(--green-bg)",
            border: "1px solid var(--green-border)",
            borderRadius: "var(--radius-sm)",
            marginBottom: 16,
            fontSize: 13,
            color: "var(--green)",
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          {success}
        </div>
      )}

      {/* Store Form */}
      <div
        style={{
          padding: 20,
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          marginBottom: 32,
        }}
      >
        <form onSubmit={handleStore}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                  color: "var(--text-muted)",
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. github_password"
                required
                style={{
                  width: "100%",
                  height: 36,
                  padding: "0 12px",
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text)",
                  fontSize: 13,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                  color: "var(--text-muted)",
                }}
              >
                Value
              </label>
              <input
                type="password"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Secret value"
                required
                style={{
                  width: "100%",
                  height: 36,
                  padding: "0 12px",
                  backgroundColor: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text)",
                  fontSize: 13,
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              height: 34,
              padding: "0 16px",
              backgroundColor: loading ? "var(--border)" : "var(--blue-bg)",
              color: loading ? "var(--text-dim)" : "var(--blue)",
              border: `1px solid ${loading ? "var(--border)" : "var(--blue-border)"}`,
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!loading)
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "var(--blue-bg-hover)";
            }}
            onMouseLeave={(e) => {
              if (!loading)
                (e.target as HTMLButtonElement).style.backgroundColor =
                  "var(--blue-bg)";
            }}
          >
            {loading ? "Storing..." : "Store Credential"}
          </button>
          </div>
        </form>
      </div>

      {/* Credentials Table */}
      <div>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-muted)",
            marginBottom: 12,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Stored Credentials
        </h2>

        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 80px",
              padding: "10px 16px",
              backgroundColor: "var(--card)",
              borderBottom: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <span>Name</span>
            <span>Created</span>
            <span></span>
          </div>

          {/* Table Body */}
          {fetching ? (
            <div style={{ padding: "32px 16px", textAlign: "center" }}>
              <span style={{ color: "var(--text-dim)", fontSize: 13 }}>
                Loading...
              </span>
            </div>
          ) : credentials.length === 0 ? (
            <div style={{ padding: "40px 16px", textAlign: "center" }}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-dim)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ margin: "0 auto 12px", opacity: 0.5 }}
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 4 }}>
                No credentials stored yet
              </p>
              <p style={{ color: "var(--text-dim)", fontSize: 12, opacity: 0.6 }}>
                Add one above to get started
              </p>
            </div>
          ) : (
            credentials.map((cred, i) => (
              <div
                key={cred.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 80px",
                  padding: "12px 16px",
                  alignItems: "center",
                  borderBottom:
                    i < credentials.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                  transition: "background-color 0.1s",
                  animation: "slideIn 0.2s ease-out",
                  animationDelay: `${i * 0.03}s`,
                  animationFillMode: "backwards",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                    "rgba(255,255,255,0.02)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.backgroundColor =
                    "transparent")
                }
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "var(--font-mono)",
                    color: "var(--text)",
                  }}
                >
                  {cred.name}
                </span>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {new Date(cred.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <div style={{ textAlign: "right" }}>
                  <button
                    onClick={() => handleDelete(cred.name)}
                    disabled={deletingName === cred.name}
                    style={{
                      padding: "4px 10px",
                      backgroundColor:
                        deletingName === cred.name
                          ? "var(--border)"
                          : "var(--red-bg)",
                      border: `1px solid ${deletingName === cred.name ? "var(--border)" : "var(--red-border)"}`,
                      borderRadius: "var(--radius-sm)",
                      color:
                        deletingName === cred.name
                          ? "var(--text-dim)"
                          : "var(--red)",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor:
                        deletingName === cred.name
                          ? "not-allowed"
                          : "pointer",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (deletingName !== cred.name)
                        (e.target as HTMLButtonElement).style.backgroundColor =
                          "var(--red-bg-hover)";
                    }}
                    onMouseLeave={(e) => {
                      if (deletingName !== cred.name)
                        (e.target as HTMLButtonElement).style.backgroundColor =
                          "var(--red-bg)";
                    }}
                  >
                    {deletingName === cred.name ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
