import { useState, useEffect, useCallback } from "react";

/**
 * useProctoring Hook
 * Handles tab-switch detection, copy-paste blocking, and hotkey prevention.
 * 
 * @param {string|boolean} active - Pass contestId or true to enable proctoring.
 */
export const useProctoring = (active) => {
    const [isLocked, setIsLocked] = useState(false);
    const [strikeCount, setStrikeCount] = useState(() => {
        const saved = localStorage.getItem(`proctoring_strikes_${active}`);
        return saved ? parseInt(saved) : 0;
    });

    const lock = useCallback(() => {
        if (!active) return;
        setIsLocked(true);
    }, [active]);

    const unlock = useCallback(() => {
        setIsLocked(false);
        setStrikeCount(prev => {
            const next = prev + 1;
            localStorage.setItem(`proctoring_strikes_${active}`, next.toString());
            return next;
        });
    }, [active]);

    useEffect(() => {
        if (!active) {
            setIsLocked(false);
            return;
        }

        // 1. Tab Switch Detection (Visibility API)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                console.warn("[Proctoring] Visibility lost - Locking UI");
                lock();
            }
        };

        // 2. Blur detection (Window Focus)
        const handleBlur = () => {
            console.warn("[Proctoring] Window blurred - Locking UI");
            lock();
        };

        // 3. Event Blocking (Copy, Paste, Cut, Right Click)
        const blockEvent = (e) => {
            e.preventDefault();
            console.warn(`[Proctoring] Blocked ${e.type} attempt`);
        };

        // 4. Hotkey Blocking
        const handleKeyDown = (e) => {
            // Block Ctrl+C, Ctrl+V, Ctrl+X
            if ((e.ctrlKey || e.metaKey) && ["c", "v", "x", "p"].includes(e.key.toLowerCase())) {
                blockEvent(e);
            }
            // Block F12, Ctrl+Shift+I (Inspect)
            if (e.key === "F12" || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I")) {
                blockEvent(e);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        document.addEventListener("copy", blockEvent);
        document.addEventListener("paste", blockEvent);
        document.addEventListener("cut", blockEvent);
        document.addEventListener("contextmenu", blockEvent);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            document.removeEventListener("copy", blockEvent);
            document.removeEventListener("paste", blockEvent);
            document.removeEventListener("cut", blockEvent);
            document.removeEventListener("contextmenu", blockEvent);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [active, lock]);

    return { isLocked, strikeCount, unlock };
};
