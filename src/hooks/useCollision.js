// Collision detection utilities

export function checkCollision(player, obstacle) {
    // Player hitbox (adjusted for visual representation)
    const playerBox = {
        left: player.x - 25,
        right: player.x + 25,
        top: player.y - (player.isSliding ? 30 : 80),
        bottom: player.y,
        front: player.z - 20,
        back: player.z + 20
    };

    // Obstacle hitbox
    const obstacleBox = {
        left: obstacle.x - obstacle.width / 2,
        right: obstacle.x + obstacle.width / 2,
        top: obstacle.y - obstacle.height,
        bottom: obstacle.y,
        front: obstacle.z - obstacle.depth / 2,
        back: obstacle.z + obstacle.depth / 2
    };

    // Check if player can jump over (only for low obstacles)
    if (player.isJumping && obstacle.type === 'low') {
        return false;
    }

    // Check if player can slide under (only for high obstacles)
    if (player.isSliding && obstacle.type === 'high') {
        return false;
    }

    // AABB collision detection
    const collisionX = playerBox.right > obstacleBox.left && playerBox.left < obstacleBox.right;
    const collisionY = playerBox.bottom > obstacleBox.top && playerBox.top < obstacleBox.bottom;
    const collisionZ = playerBox.back > obstacleBox.front && playerBox.front < obstacleBox.back;

    return collisionX && collisionY && collisionZ;
}

export function checkCoinCollection(player, coin) {
    const distance = Math.sqrt(
        Math.pow(player.x - coin.x, 2) +
        Math.pow((player.y - 40) - coin.y, 2) +
        Math.pow(player.z - coin.z, 2)
    );

    return distance < 50;
}
