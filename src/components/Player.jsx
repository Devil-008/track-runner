import React from 'react';
import './Player.css';

function Player({ lane, isJumping, isSliding, isRunning }) {
    const getPlayerClasses = () => {
        const classes = ['player-container'];
        classes.push(`lane-${lane}`);
        if (isJumping) classes.push('jumping');
        if (isSliding) classes.push('sliding');
        return classes.join(' ');
    };

    return (
        <div className={getPlayerClasses()}>
            <div className={`player ${isRunning ? 'running' : ''}`}>
                {/* Hair */}
                <div className="player-hair"></div>

                {/* Head */}
                <div className="player-head"></div>

                {/* Body */}
                <div className="player-body"></div>

                {/* Arms */}
                <div className="player-arms">
                    <div className="player-arm left"></div>
                    <div className="player-arm right"></div>
                </div>

                {/* Legs */}
                <div className="player-legs">
                    <div className="player-leg"></div>
                    <div className="player-leg"></div>
                </div>
            </div>

            {/* Shadow */}
            <div className="player-shadow"></div>
        </div>
    );
}

export default Player;
