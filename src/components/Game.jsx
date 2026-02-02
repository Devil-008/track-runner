import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useInput } from '../hooks/useInput';
import { checkCollision, checkCoinCollection } from '../hooks/useCollision';
import Background from './Background';
import Track from './Track';
import Player from './Player';
import Obstacle from './Obstacle';
import Coin from './Coin';
import HUD from './HUD';
import Menu from './Menu';
import './Game.css';

// Game Constants
const INITIAL_SPEED = 200;
const SPEED_INCREMENT = 5;
const MAX_SPEED = 600;
const OBSTACLE_SPAWN_INTERVAL = 2000;
const COIN_SPAWN_INTERVAL = 800;
const JUMP_DURATION = 500;
const SLIDE_DURATION = 600;
const LANES = [0, 1, 2]; // Left, Center, Right

function Game() {
    // Game State
    const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameover'
    const [score, setScore] = useState(0);
    const [coins, setCoins] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('subwayRunnerHighScore');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [isNewHighScore, setIsNewHighScore] = useState(false);

    // Player State
    const [playerLane, setPlayerLane] = useState(1); // Start in center
    const [isJumping, setIsJumping] = useState(false);
    const [isSliding, setIsSliding] = useState(false);

    // Game Objects
    const [obstacles, setObstacles] = useState([]);
    const [coinObjects, setCoinObjects] = useState([]);

    // Speed
    const [gameSpeed, setGameSpeed] = useState(INITIAL_SPEED);

    // Refs for timing
    const lastObstacleSpawn = useRef(0);
    const lastCoinSpawn = useRef(0);
    const idCounter = useRef(0);
    const distanceTraveled = useRef(0);

    // Generate unique ID
    const generateId = () => {
        idCounter.current += 1;
        return idCounter.current;
    };

    // Handle player input
    const handleInput = useCallback((action) => {
        if (gameState !== 'playing') return;

        switch (action) {
            case 'left':
                setPlayerLane((prev) => Math.max(0, prev - 1));
                break;
            case 'right':
                setPlayerLane((prev) => Math.min(2, prev + 1));
                break;
            case 'jump':
                if (!isJumping && !isSliding) {
                    setIsJumping(true);
                    setTimeout(() => setIsJumping(false), JUMP_DURATION);
                }
                break;
            case 'slide':
                if (!isSliding && !isJumping) {
                    setIsSliding(true);
                    setTimeout(() => setIsSliding(false), SLIDE_DURATION);
                }
                break;
            default:
                break;
        }
    }, [gameState, isJumping, isSliding]);

    // Register input handlers
    useInput(handleInput, gameState === 'playing');

    // Spawn obstacle
    const spawnObstacle = useCallback(() => {
        const lane = LANES[Math.floor(Math.random() * LANES.length)];
        const types = ['normal', 'normal', 'normal', 'high']; // 25% chance for high obstacle
        const type = types[Math.floor(Math.random() * types.length)];

        const newObstacle = {
            id: generateId(),
            lane,
            type,
            z: 500, // Start far away
            x: (lane - 1) * 100, // -100, 0, 100
            y: 0,
            width: 70,
            height: type === 'high' ? 60 : 90,
            depth: 50
        };

        setObstacles((prev) => [...prev, newObstacle]);
    }, []);

    // Spawn coin
    const spawnCoin = useCallback(() => {
        const lane = LANES[Math.floor(Math.random() * LANES.length)];

        // Sometimes spawn a line of coins
        const coinCount = Math.random() > 0.7 ? 3 : 1;
        const newCoins = [];

        for (let i = 0; i < coinCount; i++) {
            newCoins.push({
                id: generateId(),
                lane,
                z: 500 + (i * 60), // Spread out
                x: (lane - 1) * 100,
                y: 40, // Height above ground
                collected: false
            });
        }

        setCoinObjects((prev) => [...prev, ...newCoins]);
    }, []);

    // Handle game over - defined before gameUpdate to avoid reference error
    const handleGameOver = useCallback(() => {
        setGameState('gameover');

        // Check for new high score
        const currentScore = Math.floor(distanceTraveled.current / 10);
        if (currentScore > highScore) {
            setHighScore(currentScore);
            setIsNewHighScore(true);
            localStorage.setItem('subwayRunnerHighScore', currentScore.toString());
        } else {
            setIsNewHighScore(false);
        }
    }, [highScore]);

    // Game loop update
    const gameUpdate = useCallback((deltaTime) => {
        if (gameState !== 'playing') return;

        // Update distance and score
        distanceTraveled.current += gameSpeed * deltaTime;
        setScore(Math.floor(distanceTraveled.current / 10));

        // Increase speed over time
        setGameSpeed((prev) => Math.min(prev + SPEED_INCREMENT * deltaTime, MAX_SPEED));

        // Spawn obstacles
        const now = Date.now();
        if (now - lastObstacleSpawn.current > OBSTACLE_SPAWN_INTERVAL - (gameSpeed - INITIAL_SPEED)) {
            spawnObstacle();
            lastObstacleSpawn.current = now;
        }

        // Spawn coins
        if (now - lastCoinSpawn.current > COIN_SPAWN_INTERVAL) {
            spawnCoin();
            lastCoinSpawn.current = now;
        }

        // Update obstacles
        setObstacles((prev) => {
            return prev
                .map((obstacle) => ({
                    ...obstacle,
                    z: obstacle.z - gameSpeed * deltaTime
                }))
                .filter((obstacle) => obstacle.z > -100);
        });

        // Update coins and check collection in the same update
        setCoinObjects((prev) => {
            const updatedCoins = [];
            let coinsCollected = 0;

            for (const coin of prev) {
                const newZ = coin.z - gameSpeed * deltaTime;

                // Check if coin should be collected (same lane and in collection zone)
                if (!coin.collected && coin.lane === playerLane && newZ < 50 && newZ > -30) {
                    // Coin collected!
                    coinsCollected++;
                    continue; // Don't add to updatedCoins (removes it)
                }

                // Keep coin if still on screen
                if (newZ > -100) {
                    updatedCoins.push({
                        ...coin,
                        z: newZ
                    });
                }
            }

            // Update coin count if any collected
            if (coinsCollected > 0) {
                setCoins((c) => c + coinsCollected);
                setScore((s) => s + coinsCollected * 10);
            }

            return updatedCoins;
        });

        // Check collisions
        const player = {
            x: (playerLane - 1) * 100,
            y: 0,
            z: 0,
            isJumping,
            isSliding
        };

        // Check obstacle collisions
        for (const obstacle of obstacles) {
            if (obstacle.z < 50 && obstacle.z > -30) { // Collision zone
                if (obstacle.lane === playerLane) {
                    const collision = checkCollision(player, obstacle);
                    if (collision) {
                        handleGameOver();
                        return;
                    }
                }
            }
        }
    }, [gameState, gameSpeed, obstacles, playerLane, isJumping, isSliding, spawnObstacle, spawnCoin, handleGameOver]);

    // Use game loop
    useGameLoop(gameUpdate, gameState === 'playing');

    // Start game
    const handleStart = () => {
        resetGame();
        setGameState('playing');
    };

    // Restart game
    const handleRestart = () => {
        resetGame();
        setGameState('playing');
    };

    // Reset game state
    const resetGame = () => {
        setScore(0);
        setCoins(0);
        setPlayerLane(1);
        setIsJumping(false);
        setIsSliding(false);
        setObstacles([]);
        setCoinObjects([]);
        setGameSpeed(INITIAL_SPEED);
        distanceTraveled.current = 0;
        lastObstacleSpawn.current = 0;
        lastCoinSpawn.current = 0;
        idCounter.current = 0;
    };

    return (
        <div className={`game-container ${gameState === 'gameover' ? 'shake' : ''}`}>
            <div className="game-world">
                {/* Background with city and trains */}
                <Background />

                {/* Track */}
                <Track speed={gameSpeed} />

                {/* Coins */}
                <Coin coins={coinObjects} />

                {/* Obstacles */}
                <Obstacle obstacles={obstacles} />

                {/* Player */}
                <Player
                    lane={playerLane}
                    isJumping={isJumping}
                    isSliding={isSliding}
                    isRunning={gameState === 'playing'}
                />
            </div>

            {/* HUD */}
            {gameState === 'playing' && (
                <HUD score={score} coins={coins} highScore={highScore} />
            )}

            {/* Menus */}
            {gameState === 'menu' && (
                <Menu type="start" onPlay={handleStart} />
            )}

            {gameState === 'gameover' && (
                <Menu
                    type="gameover"
                    score={score}
                    coins={coins}
                    highScore={highScore}
                    isNewHighScore={isNewHighScore}
                    onRestart={handleRestart}
                />
            )}
        </div>
    );
}

export default Game;
