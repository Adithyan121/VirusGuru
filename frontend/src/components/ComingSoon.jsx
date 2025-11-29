import React from 'react';

const ComingSoon = () => {
    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Coming Soon...</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--secondary-color)' }}>
                This feature is currently under construction. Stay tuned for updates!
            </p>
        </div>
    );
};

export default ComingSoon;
