import React from 'react';
import './Track.css';

function Track({ speed }) {
    return (
        <div className="track-container">
            <div className="track">
                {/* Track Surface */}
                <div className="track-surface"></div>

                {/* Sleepers */}
                <div className="track-sleepers"></div>

                {/* Rails */}
                <div className="track-rail left-outer"></div>
                <div className="track-rail left-inner"></div>
                <div className="track-rail right-inner"></div>
                <div className="track-rail right-outer"></div>

                {/* Lane Dividers */}
                <div className="lane-divider left"></div>
                <div className="lane-divider right"></div>

                {/* Center Track Lines */}
                <div className="track-lines">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="track-line"
                            style={{ bottom: `${i * 60}px` }}
                        />
                    ))}
                </div>

                {/* Glow Effect */}
                <div className="track-glow"></div>
            </div>

            {/* Speed Lines */}
            <div className="speed-lines">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="speed-line"
                        style={{
                            left: `${10 + i * 12}%`,
                            animationDelay: `${i * 0.05}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Track;
