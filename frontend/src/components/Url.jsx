import React, { useEffect, useState } from "react";
import { scanUrl as apiScanUrl, getAnalysis } from "../api";
import search_logo from "../assets/search.png"; // adjust path
import "./space.css";

const Url = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const container = document.querySelector(".stars");

    for (let i = 0; i < 200; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = Math.random() * 100 + "vw";
      star.style.top = Math.random() * 100 + "vh";
      star.style.animationDelay = Math.random() * 2 + "s";
      container.appendChild(star);
    }

    const shootLayer = document.querySelector(".shooting-stars");
    const shootingInterval = setInterval(() => {
      const s = document.createElement("div");
      s.className = "shooting-star";
      s.style.left = Math.random() * 100 + "vw";
      shootLayer.appendChild(s);

      setTimeout(() => s.remove(), 1500);
    }, 3500);

    const move = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      container.style.transform = `translate(${x}px, ${y}px)`;
    };

    document.addEventListener("mousemove", move);

    return () => {
      clearInterval(shootingInterval);
      document.removeEventListener("mousemove", move);
      container.innerHTML = "";
      shootLayer.innerHTML = "";
    };
  }, []);

  const handleScan = async () => {
    if (!url) return alert("Please enter a URL or domain");
    setLoading(true);
    setResult(null);

    try {
      // 1️⃣ Request scan
      const submitData = await apiScanUrl(url);
      const analysisId = submitData.data.id;

      // 2️⃣ Poll until analysis completes
      let scanCompleted = false;
      let finalReport = null;

      while (!scanCompleted) {
        const reportData = await getAnalysis(analysisId);
        const status = reportData.data.attributes.status;
        finalReport = reportData;

        if (status === "completed") {
          scanCompleted = true;
        } else {
          await new Promise((r) => setTimeout(r, 2000)); // wait 2 sec
        }
      }

      setResult(finalReport);
    } catch (err) {
      console.error(err);
      alert("Error scanning URL");
    }

    setLoading(false);
  };

  const renderResults = () => {
    if (!result) return null;

    const attr = result.data.attributes;
    const urlMeta = result.meta.url_info;
    const engines = attr.results || {};

    // Filter for active threats only
    const activeThreats = Object.entries(engines)
      .filter(([_, data]) => data.category === "malicious" || data.category === "phishing")
      .sort((a, b) => {
        // Sort by result name just to have some order
        return (a[1].result || "").localeCompare(b[1].result || "");
      });

    const maliciousCount = activeThreats.length;
    const isSafe = maliciousCount === 0;

    return (
      <div style={{ marginTop: "30px", textAlign: "left" }}>
        {/* ================= RESULT SUMMARY ================= */}
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px",
            backgroundColor: isSafe ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)",
            color: isSafe ? "#28a745" : "#dc3545",
            border: `1px solid ${isSafe ? "#28a745" : "#dc3545"}`,
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {isSafe ? "✅ This URL is Safe" : "⚠️ Malicious Threats Found!"}
          </h2>
          <p style={{ margin: "5px 0 0 0" }}>
            {isSafe
              ? "No security vendors flagged this URL as malicious."
              : `${maliciousCount} security vendor(s) flagged this URL as malicious.`}
          </p>
        </div>

        {/* ================= BOT PROMOTION ================= */}
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: "#2c2c2c",
            color: "#e0e0e0",
            borderRadius: "5px",
            textAlign: "center",
            border: "1px solid #333",
          }}
        >
          <p style={{ margin: 0 }}>
            🤖 Want to scan on the go? Use our{" "}
            <a
              href={import.meta.env.VITE_TELEGRAM_BOT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: "bold", color: "#007bff" }}
            >
              Official Telegram Bot
            </a>
          </p>
        </div>

        {/* ================= DETAILS ================= */}
        <h3 style={{ color: "#fff", borderBottom: "1px solid #444", paddingBottom: "10px" }}>Details</h3>
        <table style={{ width: "100%", marginBottom: "30px", color: "#ccc" }}>
          <tbody>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #333" }}>Final URL</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #333" }}>{urlMeta.url || attr.last_final_url || "N/A"}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #333" }}>Serving IP</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #333" }}>{attr.last_serving_ip_address || "N/A"}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", borderBottom: "1px solid #333" }}>Last Analysis</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #333" }}>{attr.date ? new Date(attr.date * 1000).toUTCString() : "N/A"}</td>
            </tr>
          </tbody>
        </table>

        {/* ================= ACTIVE THREATS ================= */}
        {activeThreats.length > 0 && (
          <>
            <h3 style={{ color: "#dc3545", borderBottom: "1px solid #dc3545", paddingBottom: "10px" }}>Active Threats Detected</h3>
            <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #333", borderRadius: "8px", marginBottom: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ position: "sticky", top: 0, backgroundColor: "#2c2c2c" }}>
                  <tr>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff" }}>Engine</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#fff" }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {activeThreats.map(([engine, data], index) => (
                    <tr key={engine} style={{ backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                      <td style={{ padding: "10px", borderBottom: "1px solid #333", color: "#ccc" }}>{engine}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #333", color: "#dc3545", fontWeight: "bold" }}>
                        {data.result || data.category}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-background">
        <div className="stars"></div>
        <div className="shooting-stars"></div>
      </div>

      {/* Use page-content for standard flow to avoid overlap, but add min-height/centering when empty */}
      <div
        className="page-content"
        style={{
          display: result ? "block" : "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: result ? "auto" : "60vh"
        }}
      >
        <div
          className="card"
          style={{
            maxWidth: "800px",
            width: "100%",
            margin: "auto",
            padding: "30px",
            backgroundColor: "rgba(45, 45, 45, 0.95)",
            borderRadius: "12px",
            textAlign: "center",
            color: "#e0e0e0",
          }}
        >
          <img
            src={search_logo}
            alt="VirusGuru Logo"
            style={{ height: "80px", marginBottom: "20px" }}
          />

          <p style={{ marginBottom: "20px" }}>
            Analyse suspicious domains, IPs and URLs to detect malware and other breaches...
          </p>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Enter URL, IP, domain, or hash"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                flex: "1 1 300px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                minWidth: "200px",
                backgroundColor: "#2c2c2c",
                color: "#fff"
              }}
            />
            <button
              onClick={handleScan}
              style={{
                padding: "10px 25px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#007BFF",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
                minWidth: "120px",
              }}
            >
              Scan URL
            </button>
          </div>

          {loading && <p style={{ marginTop: "20px", color: "#ccc" }}>🔄 Scanning… please wait 5–10 sec</p>}

          {renderResults()}
        </div>
      </div>
    </>
  );
};

export default Url;
