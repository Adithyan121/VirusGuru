import React from 'react';

const About = () => {
    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>About VirusGuru</h2>

            <section style={{ marginBottom: '2rem' }}>
                <h3>What is VirusGuru?</h3>
                <p>
                    VirusGuru is an advanced threat-analysis platform designed to help you quickly identify whether 
                    digital content is safe. With support for URL, IP address, domain, and file hash scanning, 
                    VirusGuru offers a complete, multi-layered security check to protect you from malware, 
                    phishing, scam websites, and other online threats.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3>What VirusGuru Can Scan</h3>
                <p><strong>• URLs:</strong> Detect malicious websites, phishing pages, and dangerous redirects.</p>
                <p><strong>• IP Addresses:</strong> Identify suspicious or compromised servers and unsafe network sources.</p>
                <p><strong>• Domains:</strong> Check domain reputation, age, blacklist status, and safety score.</p>
                <p><strong>• Hashes:</strong> Scan file hashes (MD5, SHA1, SHA256) to determine if a file is known to contain malware.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3>Why VirusGuru?</h3>
                <p>
                    Threats on the internet evolve every day. A harmless-looking link can lead to data theft,
                    device compromise, or financial loss. VirusGuru provides a fast and reliable way to verify 
                    suspicious content before interacting with it, giving you the confidence to browse safely.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3>How VirusGuru Helps You</h3>
                <p>
                    Whether you're checking a forwarded message, an email link, an unknown IP address, or a 
                    file hash, VirusGuru offers instant, clear results. Our platform is beginners-friendly and 
                    designed for anyone who wants to protect themselves from modern cyber risks without needing 
                    technical knowledge.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3>Official Telegram Bot</h3>
                <p>
                    Stay protected wherever you are. With our official Telegram bot, you can automatically scan
                    URLs, domains, and IP addresses directly from your chats—no need to copy and paste into a browser.
                </p>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <a
                        href={import.meta.env.VITE_TELEGRAM_BOT_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#0088cc',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Open Telegram Bot
                    </a>
                </div>
            </section>

            <section>
                <h3>About the Creator</h3>
                <p>
                    VirusGuru was built with a dedication to cybersecurity and a vision of making the internet 
                    safer for everyone. By providing powerful scanning tools in a simple interface, the project 
                    empowers users of all skill levels to stay protected from online threats.
                </p>
            </section>
        </div>
    );
};

export default About;
