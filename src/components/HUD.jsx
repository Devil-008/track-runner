import React from 'react';
import './HUD.css';

function HUD({ score, coins, highScore }) {
    return (
        <div className="hud">
            {/* Left Side - Score */}
            <div className="hud-score">
                <span className="score-label">Score</span>
                <span className="score-value">{score.toLocaleString()}</span>
                <div className="hud-highscore">
                    <span className="highscore-label">Best:</span>
                    <span className="highscore-value">{highScore.toLocaleString()}</span>
                </div>
            </div>

            {/* Right Side - Coins */}
            <div className="hud-coins">
                <div className="coin-icon"></div>
                <span className="coin-count">{coins}</span>
            </div>
        </div>
    );
}

export default HUD;
