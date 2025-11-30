import React, { useEffect } from "react";
import "./space.css";

const Abt = () => {
  useEffect(() => {
    const container = document.querySelector(".stars");

    // Create 200 stars randomly positioned
    for (let i = 0; i < 200; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = Math.random() * 100 + "vw";
      star.style.top = Math.random() * 100 + "vh";
      star.style.animationDelay = Math.random() * 2 + "s";
      container.appendChild(star);
    }

    // Shooting stars interval
    const shootLayer = document.querySelector(".shooting-stars");
    const shootingInterval = setInterval(() => {
      const s = document.createElement("div");
      s.className = "shooting-star";
      s.style.left = Math.random() * 100 + "vw";
      shootLayer.appendChild(s);
      setTimeout(() => s.remove(), 1500);
    }, 3500);

    // Mouse move parallax effect on stars container
    const move = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      container.style.transform = `translate(${x}px, ${y}px)`;
    };
    document.addEventListener("mousemove", move);

    // Cleanup on unmount
    return () => {
      clearInterval(shootingInterval);
      document.removeEventListener("mousemove", move);
      container.innerHTML = "";
      shootLayer.innerHTML = "";
    };
  }, []);

  return (
    <>
      {/* Starry background fixed */}
      <div className="space-background">
        <div className="stars"></div>
        <div className="shooting-stars"></div>
      </div>

      {/* Scrollable content */}
      <div className="page-content">
        <div
          className="card"
          style={{
            backgroundColor: "rgba(30, 30, 30, 0.85)", // Slightly darker/more opaque
            backdropFilter: "blur(10px)", // Glassmorphism
            borderRadius: "16px",
            padding: "40px",
            color: "#f0f0f0",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <h2 style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "2.5rem",
            background: "linear-gradient(45deg, #007bff, #00d2ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "700"
          }}>
            About VirusGuru
          </h2>

          <section style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#00d2ff", marginBottom: "15px", fontSize: "1.5rem" }}>What is VirusGuru?</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#ccc" }}>
              VirusGuru is an advanced threat-analysis platform designed to help you quickly identify
              whether digital content is safe. With support for URL, IP address, domain, and file
              hash scanning, VirusGuru offers a complete, multi-layered security check to protect you
              from malware, phishing, scam websites, and other online threats.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#00d2ff", marginBottom: "15px", fontSize: "1.5rem" }}>What VirusGuru Can Scan</h3>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "1.1rem", lineHeight: "1.8", color: "#ccc" }}>
              <li style={{ marginBottom: "10px" }}><strong style={{ color: "#fff" }}>• URLs:</strong> Detect malicious websites, phishing pages, and dangerous redirects.</li>
              <li style={{ marginBottom: "10px" }}><strong style={{ color: "#fff" }}>• IP Addresses:</strong> Identify suspicious or compromised servers and unsafe network sources.</li>
              <li style={{ marginBottom: "10px" }}><strong style={{ color: "#fff" }}>• Domains:</strong> Check domain reputation, age, blacklist status, and safety score.</li>
              <li><strong style={{ color: "#fff" }}>• Hashes:</strong> Scan file hashes (MD5, SHA1, SHA256) to determine if a file is known to contain malware.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#00d2ff", marginBottom: "15px", fontSize: "1.5rem" }}>Why VirusGuru?</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#ccc" }}>
              Threats on the internet evolve every day. A harmless-looking link can lead to data theft,
              device compromise, or financial loss. VirusGuru provides a fast and reliable way to verify
              suspicious content before interacting with it, giving you the confidence to browse safely.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#00d2ff", marginBottom: "15px", fontSize: "1.5rem" }}>How VirusGuru Helps You</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#ccc" }}>
              Whether you're checking a forwarded message, an email link, an unknown IP address, or a
              file hash, VirusGuru offers instant, clear results. Our platform is beginners-friendly and
              designed for anyone who wants to protect themselves from modern cyber risks without needing
              technical knowledge.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#00d2ff", marginBottom: "15px", fontSize: "1.5rem" }}>Official Telegram Bot</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#ccc", marginBottom: "20px" }}>
              Stay protected wherever you are. With our official Telegram bot, you can automatically scan
              URLs, domains, and IP addresses directly from your chats—no need to copy and paste into a browser.
            </p>
            <div style={{ textAlign: "center" }}>
              <a
                href={import.meta.env.VITE_TELEGRAM_BOT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "12px 30px",
                  backgroundColor: "#0088cc",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 4px 15px rgba(0, 136, 204, 0.4)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 136, 204, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 136, 204, 0.4)";
                }}
              >
                Open Telegram Bot
              </a>
            </div>
          </section>

          <section>
            <h3 style={{ color: "#00d2ff", marginBottom: "15px", fontSize: "1.5rem" }}>About the Creator</h3>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#ccc" }}>
              VirusGuru was built with a dedication to cybersecurity and a vision of making the internet
              safer for everyone. By providing powerful scanning tools in a simple interface, the project
              empowers users of all skill levels to stay protected from online threats.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Abt;
