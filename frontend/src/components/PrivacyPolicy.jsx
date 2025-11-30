import React, { useEffect } from "react";
import "./space.css";

const PrivacyPolicy = () => {
    useEffect(() => {
        const container = document.querySelector(".stars");

        // Create 200 stars randomly positioned
        // Check if stars are already created to avoid duplication on re-renders if strict mode is on
        if (container && container.childElementCount === 0) {
            for (let i = 0; i < 200; i++) {
                const star = document.createElement("div");
                star.className = "star";
                star.style.left = Math.random() * 100 + "vw";
                star.style.top = Math.random() * 100 + "vh";
                star.style.animationDelay = Math.random() * 2 + "s";
                container.appendChild(star);
            }
        }

        // Shooting stars interval
        const shootLayer = document.querySelector(".shooting-stars");
        const shootingInterval = setInterval(() => {
            if (shootLayer) {
                const s = document.createElement("div");
                s.className = "shooting-star";
                s.style.left = Math.random() * 100 + "vw";
                shootLayer.appendChild(s);
                setTimeout(() => s.remove(), 1500);
            }
        }, 3500);

        // Mouse move parallax effect on stars container
        const move = (e) => {
            if (container) {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                container.style.transform = `translate(${x}px, ${y}px)`;
            }
        };
        document.addEventListener("mousemove", move);

        // Cleanup on unmount
        return () => {
            clearInterval(shootingInterval);
            document.removeEventListener("mousemove", move);
            if (container) container.innerHTML = "";
            if (shootLayer) shootLayer.innerHTML = "";
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
                        backgroundColor: "transparent", // Slightly darker/more opaque
                        // backdropFilter: "blur(10px)",
                        borderRadius: "16px",
                        padding: "40px",
                        color: "#f0f0f0",
                        border: "none",
                        // border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                        fontFamily: "'Inter', sans-serif",
                        minHeight: "60vh", // Ensure it takes up some space
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center"
                    }}
                >
                    <h2 style={{
                        marginBottom: "30px",
                        fontSize: "2.5rem",
                        background: "linear-gradient(45deg, #ffffffff, #ffffffff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "700"
                    }}>
                        Privacy Policy
                    </h2>

                   <section style={{ marginBottom: "30px", maxWidth: "800px", textAlign: "left" }}>
                        {/* <h3
                            style={{
                                color: "#00d2ff",
                                marginBottom: "15px",
                                fontSize: "1.8rem"
                            }}
                        >
                            Privacy Policy
                        </h3> */}

                        <p style={{ fontSize: "1.1rem", color: "#ccc", marginBottom: "15px" }}>
                            At VirusGuru, your privacy is important to us. We keep things simple and transparent.
                        </p>

                        <div
                            style={{
                                // padding: "20px",
                                border: "none",
                                borderRadius: "8px",
                                backgroundColor: "transparent",
                                marginBottom: "25px"
                            }}
                        >
                            <ul style={{ color: "#e0e0e0", lineHeight: "1.8", fontSize: "1.1rem", paddingLeft: "20px" }}>
                                <li>We do not collect, store, or track any personal information.</li>
                                <li>We do not use cookies, analytics tools, or tracking technologies.</li>
                                <li>You remain completely anonymous while using our site.</li>
                                <li>
                                    As part of the website’s functionality, you may choose to submit items such as:
                                    <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                                        <li>URLs</li>
                                        <li>Domains</li>
                                        <li>IP addresses</li>
                                        <li>File hashes (e.g., SHA-256)</li>
                                    </ul>
                                </li>
                                <li>
                                    These items are used **only** to check for malicious or suspicious activity.  
                                    We do not store them or link them to any user.
                                </li>
                                <li>
                                    Our site may connect to third-party threat-intelligence providers to look up
                                    whether a URL, domain, or file hash has been flagged before.  
                                    Only the item being checked is sent—never personal data.
                                </li>
                            </ul>
                        </div>

                        <h3
                            style={{
                                color: "#ffffffff",
                                marginBottom: "15px",
                                fontSize: "1.8rem"
                            }}
                        >
                            Disclaimer
                        </h3>

                        <div
                            style={{
                                // padding: "20px",
                                border: "none",
                                borderRadius: "8px",
                                backgroundColor: "transparent",
                                marginBottom: "25px"
                            }}
                        >
                            <ul style={{ color: "#e0e0e0", lineHeight: "1.8", fontSize: "1.1rem", paddingLeft: "20px" }}>
                                <li>
                                    VirusGuru provides scanning results for educational and informational purposes only.
                                </li>
                                <li>
                                    We do not guarantee 100% accuracy of threat reports or detection results.
                                </li>
                                <li>
                                    You are responsible for how you use any information obtained from this site.
                                </li>
                                <li>
                                    We are not responsible for any damage, loss, or issues caused by the use of our service.
                                </li>
                            </ul>
                        </div>

                        <h3
                            style={{
                                color: "#ffffffff",
                                marginBottom: "15px",
                                fontSize: "1.8rem"
                            }}
                        >
                            Policy Updates
                        </h3>

                        <p style={{ fontSize: "1.1rem", color: "#ccc", lineHeight: "1.8" }}>
                            We may update this Privacy Policy from time to time to improve our service or security.
                            Any changes will be posted on this page and will take effect immediately.
                        </p>
                    </section>


                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
