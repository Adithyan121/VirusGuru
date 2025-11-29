import React, { useState } from "react";
import axios from "axios";
import search_logo from '../assets/search.png';

const UrlScanner = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanUrl = async () => {
    setLoading(true);
    setResult(null);

    try {
      // 1️⃣ Request scan
      const submitRes = await axios.post(
        "http://localhost:5000/api/urls/scan",
        { url }
      );

      const analysisId = submitRes.data.data.id;

      // 2️⃣ Poll until analysis completes
      let scanCompleted = false;
      let finalReport = null;

      while (!scanCompleted) {
        const reportRes = await axios.get(
          `http://localhost:5000/api/analyses/${analysisId}`
        );

        const status = reportRes.data.data.attributes.status;
        finalReport = reportRes.data;

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

    const maliciousCount = Object.values(engines).filter(
      (data) => data.category === "malicious" || data.category === "phishing"
    ).length;

    const isSafe = maliciousCount === 0;

    return (

      <div className="card" style={{ marginTop: "20px" }}>
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

        {/* ================= HISTORY ================= */}
        <h3>History</h3>
        <table>
          <tbody>
            <tr>
              <td>First Submission</td>
              <td>{new Date(attr.first_submission_date * 1000).toUTCString()}</td>
            </tr>
            <tr>
              <td>Last Submission</td>
              <td>{new Date(attr.last_submission_date * 1000).toUTCString()}</td>
            </tr>
            <tr>
              <td>Last Analysis</td>
              <td>{new Date(attr.date * 1000).toUTCString()}</td>
            </tr>
            <tr>
              <td>Final URL</td>
              <td>{urlMeta.url}</td>
            </tr>
          </tbody>
        </table>

        {/* ================= DETECTION ================= */}
        <h3 style={{ marginTop: "30px" }}>Security Vendors' Analysis</h3>

        <table>
          <thead>
            <tr>
              <th>Engine</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(engines)
              .filter(([_, data]) => {
                return data.category === "malicious" || data.category === "phishing";
              })
              .map(([engine, data]) => {
                let color = "#dc3545";

                return (
                  <tr key={engine}>
                    <td>{engine}</td>
                    <td style={{ color, fontWeight: "bold" }}>
                      {data.result || data.category || "Unrated"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="card" style={{ maxWidth: "800px", margin: "auto", textAlign: "center" }}>
      {/* <h2>URL Scanner</h2> */}
      <img src={search_logo} alt="VirusGuru Logo" style={{ height: '80px', display: 'block', margin: '0 auto 20px auto' }} />
      <p>Analyse suspicious domains, IPs and URLs to detect malware and other breaches, automatically share them with the security community.</p>


      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter URL,IP address,domain,or file hash"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
        />

        <button
          onClick={scanUrl}
          style={{ padding: "10px 20px" }}
        >
          Scan URL
        </button>
      </div>

      {loading && <p>🔄 Scanning… please wait it takes 5–10 sec</p>}

      {result && renderResults()}
    </div>
  );
};

export default UrlScanner;
