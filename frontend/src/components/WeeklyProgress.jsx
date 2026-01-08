import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../hooks/usePremium';
import TimeTravelModal from './TimeTravelModal';

/**
 * WeeklyProgress - Shows weekly streak progress and premium status
 * Features:
 * - Premium banner with days remaining
 * - Week indicators (W1-W5)
 * - LeetCoins balance with actions
 * - Time Travel Pass redemption
 */
function WeeklyProgress({ streak = 0, coins = 0, timeTravelPasses = 0, onPassUsed }) {
    const navigate = useNavigate();
    const { isPremium, premiumExpiresAt } = usePremium();
    const [showTimeTravelModal, setShowTimeTravelModal] = useState(false);

    // Calculate which week we're in (1-5 based on streak)
    const currentWeek = Math.ceil((streak % 35) / 7) || 1;

    // Calculate days left in premium
    const getDaysLeft = () => {
        if (!premiumExpiresAt) return null;
        const now = new Date();
        const expires = new Date(premiumExpiresAt);
        const diff = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    const daysLeft = getDaysLeft();

    return (
        <div className="space-y-3">
            {/* Weekly Premium Banner */}
            <div className="bg-gradient-to-r from-base-300/80 to-base-300/40 rounded-xl p-3 border border-base-300/50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-semibold">Weekly Premium</span>
                        <div className="tooltip" data-tip="Complete weekly challenges for bonus rewards">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    {daysLeft !== null && (
                        <span className="text-xs text-base-content/50">{daysLeft} days left</span>
                    )}
                </div>

                {/* Week indicators */}
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((week) => (
                        <div
                            key={week}
                            className={`
                                flex-1 py-2 rounded-lg text-center text-sm font-medium
                                transition-all duration-300
                                ${week === currentWeek
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                    : week < currentWeek
                                        ? 'bg-amber-500/20 text-amber-400'
                                        : 'bg-base-200/50 text-base-content/30'
                                }
                            `}
                        >
                            W{week}
                        </div>
                    ))}
                </div>
            </div>

            {/* LeetCoins & Actions */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <span className="text-xs font-bold text-white">₿</span>
                    </div>
                    <span className="text-base-content/80 font-medium">{coins}</span>
                    <button
                        onClick={() => setShowTimeTravelModal(true)}
                        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                    >
                        Redeem
                    </button>
                    {timeTravelPasses > 0 && (
                        <span className="badge badge-sm badge-success">{timeTravelPasses} pass{timeTravelPasses > 1 ? 'es' : ''}</span>
                    )}
                </div>
                <button
                    className="text-base-content/50 hover:text-base-content text-sm font-medium transition-colors"
                    onClick={() => navigate('/store')}
                >
                    Store
                </button>
            </div>

            {/* Time Travel Modal */}
            <TimeTravelModal
                isOpen={showTimeTravelModal}
                onClose={() => setShowTimeTravelModal(false)}
                userCoins={coins}
                timeTravelPasses={timeTravelPasses}
                onSuccess={onPassUsed}
            />
        </div>
    );
}

export default WeeklyProgress;
