import React from 'react';
import './Coin.css';

function Coin({ coins }) {
    return (
        <div className="coins-container">
            <div className="coins-track">
                {coins.map((coin) => {
                    // Position along the track (0 = near player, 800 = far away)
                    const trackPosition = (coin.z / 500) * 800;

                    return (
                        <div
                            key={coin.id}
                            className={`coin lane-${coin.lane} ${coin.collected ? 'collected' : ''}`}
                            style={{
                                bottom: `${trackPosition}px`,
                                zIndex: Math.floor(500 - coin.z)
                            }}
                        >
                            <div className="coin-glow"></div>
                            <div className="coin-inner">
                                <div className="coin-face coin-front"></div>
                                <div className="coin-face coin-back"></div>
                            </div>
                            {coin.collected && (
                                <div className="coin-sparkles">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="sparkle"></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Coin;
