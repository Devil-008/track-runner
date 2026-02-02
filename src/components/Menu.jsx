import React from 'react';
import './Menu.css';

function Menu({ type, score, coins, highScore, isNewHighScore, onPlay, onRestart }) {
    if (type === 'start') {
        return (
            <div className="menu-overlay">
                <h1 className="game-title">
                    <span className="title-subway">SUBWAY</span>
                    <span className="title-runner">RUNNER</span>
                </h1>

                <p className="game-subtitle">
                    Dodge trains, collect coins, beat your high score!
                </p>

                <button className="play-btn" onClick={onPlay}>
                    ▶ PLAY
                </button>

                <div className="controls-info">
                    <h3 className="controls-title">Controls</h3>
                    <div className="controls-grid">
                        <div className="control-item">
                            <div className="control-key">←</div>
                            <span className="control-label">Move Left</span>
                        </div>
                        <div className="control-item">
                            <div className="control-key">→</div>
                            <span className="control-label">Move Right</span>
                        </div>
                        <div className="control-item">
                            <div className="control-key">↑</div>
                            <span className="control-label">Jump</span>
                        </div>
                        <div className="control-item">
                            <div className="control-key">↓</div>
                            <span className="control-label">Slide</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'gameover') {
        return (
            <div className="menu-overlay">
                <div className="game-over-content">
                    <h1 className="game-over-title">GAME OVER</h1>
                    <p className="game-over-subtitle">You crashed into an obstacle!</p>

                    {isNewHighScore && (
                        <div className="new-highscore">🎉 New High Score!</div>
                    )}

                    <div className="final-stats">
                        <div className="stat-item">
                            <div className="stat-value">{score.toLocaleString()}</div>
                            <div className="stat-label">Score</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value coins">{coins}</div>
                            <div className="stat-label">Coins</div>
                        </div>
                    </div>

                    <button className="restart-btn" onClick={onRestart}>
                        🔄 PLAY AGAIN
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

export default Menu;
