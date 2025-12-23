import { AlertTriangleIcon, RotateCcwIcon, ShieldAlertIcon } from "lucide-react";

/**
 * ProctoringOverlay Component
 * An un-skippable fullscreen overlay that appears during proctoring violations.
 */
const ProctoringOverlay = ({ isLocked, strikeCount, onUnlock }) => {
    if (!isLocked) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-base-300/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="card bg-base-100 max-w-lg w-full shadow-2xl border-4 border-error animate-in fade-in zoom-in duration-300">
                <div className="p-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="size-20 rounded-full bg-error/10 flex items-center justify-center animate-pulse">
                            <ShieldAlertIcon className="size-12 text-error" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-error">PROCTORING VIOLATION</h2>
                        <p className="text-base-content/70 text-lg">
                            We detected that you switched tabs or minimized the contest window. This is strictly prohibited.
                        </p>
                    </div>

                    <div className="bg-error/5 border border-error/10 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2 text-error font-bold">
                            <AlertTriangleIcon className="size-5" />
                            Security Strikes
                        </div>
                        <div className="text-2xl font-black text-error">{strikeCount}</div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs opacity-50 uppercase tracking-widest font-black">
                            Action Logged: Your current progress has been paused.
                        </p>
                        <button
                            onClick={onUnlock}
                            className="btn btn-error btn-block btn-lg rounded-2xl font-bold gap-2 shadow-lg shadow-error/20"
                        >
                            <RotateCcwIcon className="size-5" />
                            I Understand, Resume Contest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProctoringOverlay;
