import { Flame, Check, X } from "lucide-react";

function ChallengeCompletionModal({ isOpen, onClose, streak }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-[#282828] w-full max-w-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform transition-all duration-300 scale-100 opacity-100 flex flex-col items-center p-8 text-center animate-in zoom-in-95 fade-in duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                >
                    <X className="size-5" />
                </button>

                {/* Success Icon Wrapper */}
                <div className="relative mb-6">
                    <div className="size-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                        <Check className="size-10 text-green-500" />
                    </div>
                    {/* Subtle Glow */}
                    <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full -z-10" />
                </div>

                {/* Text Details */}
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                    Solution Accepted!
                </h2>
                <p className="text-white/60 text-sm mb-8 leading-relaxed">
                    You've successfully solved the challenge and maintained your progress.
                </p>

                {/* Streak Badge */}
                <div className="w-full bg-white/5 rounded-xl p-6 border border-white/5 mb-8 relative group overflow-hidden">
                    {/* Animated Pulse Background */}
                    <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex flex-col items-center">
                        <div className="flex items-center gap-2 text-orange-500 mb-1">
                            <Flame className="size-5 fill-orange-500 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest opacity-70">Current Streak</span>
                        </div>
                        <div className="text-5xl font-black text-white flex items-baseline gap-1">
                            <span>{streak}</span>
                            <span className="text-lg opacity-40">Days</span>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={onClose}
                    className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-white/90 transition-all active:scale-95 shadow-lg shadow-white/5"
                >
                    GREAT JOB!
                </button>

                {/* Footer Hint */}
                <p className="mt-6 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                    Keep it up! Your streak is your power.
                </p>
            </div>
        </div>
    );
}

export default ChallengeCompletionModal;
