import React from 'react';
import './Obstacle.css';

function Obstacle({ obstacles }) {
    return (
        <div className="obstacles-container">
            <div className="obstacles-track">
                {obstacles.map((obstacle) => {
                    // Position along the track (0 = near player, 800 = far away)
                    const trackPosition = (obstacle.z / 500) * 800;

                    return (
                        <div
                            key={obstacle.id}
                            className={`obstacle lane-${obstacle.lane}`}
                            style={{
                                bottom: `${trackPosition}px`,
                                zIndex: Math.floor(500 - obstacle.z)
                            }}
                        >
                            {obstacle.type === 'high' ? (
                                // Barrier to slide under
                                <div className="barrier">
                                    <div className="barrier-pole left"></div>
                                    <div className="barrier-pole right"></div>
                                    <div className="barrier-bar"></div>
                                </div>
                            ) : (
                                // Train bogie to jump over or avoid
                                <div className="train-bogie">
                                    <div className="bogie-light"></div>
                                    <div className="bogie-body">
                                        <div className="bogie-windows">
                                            <div className="bogie-window"></div>
                                            <div className="bogie-window"></div>
                                            <div className="bogie-window"></div>
                                        </div>
                                        <div className="bogie-stripe top"></div>
                                        <div className="bogie-stripe bottom"></div>
                                    </div>
                                    <div className="bogie-wheels">
                                        <div className="bogie-wheel"></div>
                                        <div className="bogie-wheel"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Obstacle;
