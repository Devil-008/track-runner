import { useEffect, useCallback, useRef } from 'react';

export function useInput(onInput, isActive) {
    const touchStartRef = useRef({ x: 0, y: 0 });

    const handleKeyDown = useCallback((e) => {
        if (!isActive) return;

        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                onInput('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                onInput('right');
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
            case ' ':
                e.preventDefault();
                onInput('jump');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                onInput('slide');
                break;
            default:
                break;
        }
    }, [onInput, isActive]);

    const handleTouchStart = useCallback((e) => {
        if (!isActive) return;
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }, [isActive]);

    const handleTouchEnd = useCallback((e) => {
        if (!isActive) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };

        const deltaX = touchEnd.x - touchStartRef.current.x;
        const deltaY = touchEnd.y - touchStartRef.current.y;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > minSwipeDistance) {
                onInput('right');
            } else if (deltaX < -minSwipeDistance) {
                onInput('left');
            }
        } else {
            if (deltaY < -minSwipeDistance) {
                onInput('jump');
            } else if (deltaY > minSwipeDistance) {
                onInput('slide');
            }
        }
    }, [onInput, isActive]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleKeyDown, handleTouchStart, handleTouchEnd]);
}
