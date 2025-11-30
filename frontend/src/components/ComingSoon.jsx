import React, { useEffect } from "react";
import "./comingsoon.css";

const ComingSoon = () => {
  useEffect(() => {
    const container = document.querySelector(".stars");

    // Generate 200 stars
    for (let i = 0; i < 200; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = Math.random() * 100 + "vw";
      star.style.top = Math.random() * 100 + "vh";
      star.style.animationDelay = Math.random() * 5 + "s";
      star.style.opacity = Math.random();
      container.appendChild(star);
    }

    // Shooting stars
    const shootingStars = document.querySelector(".shooting-stars");
    setInterval(() => {
      const s = document.createElement("div");
      s.className = "shooting-star";
      s.style.left = Math.random() * 100 + "vw";
      shootingStars.appendChild(s);

      setTimeout(() => s.remove(), 2000);
    }, 4000);

    // Parallax effect
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      container.style.transform = `translate(${x}px, ${y}px)`;
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="comingsoon-wrapper">
      <div className="stars"></div>
      <div className="shooting-stars"></div>

      <div className="content">
        <h1>Coming Soon...</h1>
        <p>This feature is under development. Stay tuned!</p>
      </div>
    </div>
  );
};

export default ComingSoon;
