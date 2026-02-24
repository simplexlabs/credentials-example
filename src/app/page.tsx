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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchCredentials = useCallback(async () => {
    try {
      const res = await fetch("/api/credentials");
      const data = await res.json();
      if (data.credentials) {
        setCredentials(data.credentials);
      }
    } catch {
      console.error("Failed to fetch credentials");
    }
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

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
        setSuccess(`Credential "${name}" stored successfully`);
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
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
        Simplex Credentials Manager
      </h1>
      <p style={{ color: "#888", marginBottom: 32, fontSize: 14 }}>
        Store encrypted credentials that your Simplex workflows can use via{" "}
        <code
          style={{
            backgroundColor: "#1a1a1a",
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: 13,
          }}
        >
          type_secret()
        </code>
      </p>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#2d1215",
            border: "1px solid #5c2127",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
            color: "#f87171",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#0d2818",
            border: "1px solid #1a5c2e",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
            color: "#4ade80",
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleStore} style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 12 }}>
          <label
            style={{ display: "block", fontSize: 14, marginBottom: 4, color: "#aaa" }}
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
              padding: "8px 12px",
              backgroundColor: "#141414",
              border: "1px solid #333",
              borderRadius: 6,
              color: "#ededed",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{ display: "block", fontSize: 14, marginBottom: 4, color: "#aaa" }}
          >
            Value
          </label>
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="The secret value to encrypt"
            required
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "#141414",
              border: "1px solid #333",
              borderRadius: 6,
              color: "#ededed",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "8px 20px",
            backgroundColor: loading ? "#333" : "#ededed",
            color: loading ? "#666" : "#0a0a0a",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Storing..." : "Store Credential"}
        </button>
      </form>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
        Stored Credentials
      </h2>

      {credentials.length === 0 ? (
        <p style={{ color: "#666", fontSize: 14 }}>No credentials stored yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {credentials.map((cred) => (
            <div
              key={cred.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "#141414",
                border: "1px solid #222",
                borderRadius: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{cred.name}</div>
                <div style={{ color: "#666", fontSize: 12 }}>
                  {new Date(cred.created_at).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => handleDelete(cred.name)}
                style={{
                  padding: "4px 12px",
                  backgroundColor: "transparent",
                  border: "1px solid #333",
                  borderRadius: 6,
                  color: "#f87171",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
