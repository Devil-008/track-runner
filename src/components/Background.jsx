import React, { useMemo } from 'react';
import './Background.css';

function Background() {
    // Generate random stars
    const stars = useMemo(() => {
        return [...Array(50)].map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 50,
            delay: Math.random() * 2,
            size: Math.random() * 2 + 1
        }));
    }, []);

    // Generate buildings
    const buildings = useMemo(() => {
        return [...Array(15)].map((_, i) => ({
            id: i,
            width: 30 + Math.random() * 50,
            height: 60 + Math.random() * 120,
            windows: Math.floor(Math.random() * 8) + 2
        }));
    }, []);

    return (
        <div className="background">
            {/* Sky */}
            <div className="sky">
                {/* Stars */}
                <div className="stars">
                    {stars.map((star) => (
                        <div
                            key={star.id}
                            className="star"
                            style={{
                                left: `${star.left}%`,
                                top: `${star.top}%`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                animationDelay: `${star.delay}s`
                            }}
                        />
                    ))}
                </div>

                {/* Moon */}
                <div className="moon"></div>
            </div>

            {/* City Skyline */}
            <div className="city-skyline">
                {buildings.map((building) => (
                    <div
                        key={building.id}
                        className="building"
                        style={{
                            width: `${building.width}px`,
                            height: `${building.height}px`
                        }}
                    >
                        {[...Array(building.windows)].map((_, j) => (
                            <div
                                key={j}
                                className={`building-window ${Math.random() > 0.6 ? 'lit' : ''}`}
                                style={{
                                    left: `${15 + (j % 3) * 30}%`,
                                    top: `${15 + Math.floor(j / 3) * 25}%`
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Background Trains */}
            <div className="background-trains">
                {/* Train moving left to right */}
                <div className="bg-train train-left" style={{ animationDelay: '0s' }}>
                    <div className="bg-train-car locomotive"></div>
                    <div className="bg-train-car"></div>
                    <div className="bg-train-car"></div>
                    <div className="bg-train-car"></div>
                </div>

                {/* Train moving right to left */}
                <div className="bg-train train-right" style={{ animationDelay: '4s' }}>
                    <div className="bg-train-car locomotive"></div>
                    <div className="bg-train-car"></div>
                    <div className="bg-train-car"></div>
                </div>
            </div>

            {/* Ground Area */}
            <div className="ground-area">
                <div className="platform left"></div>
                <div className="platform right"></div>
            </div>

            {/* Atmospheric Fog */}
            <div className="fog"></div>
        </div>
    );
}

export default Background;
