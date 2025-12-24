import { Coins, X, Sparkles, Flame } from "lucide-react";

function DailyClaimModal({ isOpen, onClose, onClaim, isPending, profile }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-base-300/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-base-100 w-full max-w-md rounded-3xl shadow-2xl border border-primary/20 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Top Gradient Bar */}
                <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 btn btn-ghost btn-sm btn-circle"
                >
                    <X className="w-5 h-5 opacity-50" />
                </button>

                <div className="p-8 text-center">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full scale-150 animate-pulse" />
                        <div className="relative bg-gradient-to-br from-yellow-300 to-yellow-500 p-6 rounded-3xl shadow-lg shadow-yellow-500/20 rotate-12">
                            <Coins className="w-12 h-12 text-white fill-white animate-bounce" />
                        </div>
                        <Sparkles className="absolute -top-2 -right-4 w-6 h-6 text-primary animate-spin-slow" />
                    </div>

                    <h2 className="text-3xl font-black mb-2 tracking-tight">Daily Reward!</h2>
                    <p className="text-base-content/60 mb-8 font-medium">
                        Good to see you again! Claim your daily free coin to grow your streak and climb the ranks.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-base-200/50 p-4 rounded-2xl border border-primary/5">
                            <div className="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-1">Current Streak</div>
                            <div className="flex items-center justify-center gap-2">
                                <Flame className={`w-5 h-5 ${profile?.streak > 0 ? "text-orange-500 fill-orange-500 animate-pulse" : "text-base-content/20"}`} />
                                <span className="text-xl font-black">{profile?.streak || 0}</span>
                            </div>
                        </div>
                        <div className="bg-base-200/50 p-4 rounded-2xl border border-primary/5">
                            <div className="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-1">Your Balance</div>
                            <div className="flex items-center justify-center gap-2">
                                <Coins className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                <span className="text-xl font-black">{profile?.coins || 0}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClaim}
                        disabled={isPending}
                        className="group btn btn-primary btn-lg w-full rounded-2xl font-black text-lg gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                        {isPending ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                Claim +1 Coin
                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-[10px] mt-4 opacity-30 uppercase font-black tracking-widest">
                        Resets every 24 hours
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DailyClaimModal;
