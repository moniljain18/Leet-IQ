import { useState } from 'react';
import { XIcon, GiftIcon } from 'lucide-react';
import axiosInstance from '../lib/axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

/**
 * TimeTravelModal - Modal for purchasing/using Time Travel Pass
 * Allows users to restore a missed streak day
 */
function TimeTravelModal({ isOpen, onClose, userCoins = 0, timeTravelPasses = 0, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState('purchase'); // 'purchase' or 'use'
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    const PASS_COST = 50;

    if (!isOpen) return null;

    const handlePurchase = async () => {
        if (userCoins < PASS_COST) {
            toast.error(`Not enough coins! You need ${PASS_COST} coins.`);
            return;
        }

        setIsLoading(true);
        try {
            const token = await getToken();

            // Find the Time Travel Pass product
            const productsRes = await axiosInstance.get('/store/products?category=digital');
            const products = productsRes.data;
            const timeTravelProduct = products.find(p =>
                p.name.toLowerCase().includes('time travel')
            );

            if (!timeTravelProduct) {
                toast.error('Time Travel Pass not available in store');
                return;
            }

            // Redeem the product
            await axiosInstance.post(`/store/redeem/${timeTravelProduct._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Time Travel Pass purchased!');
            queryClient.invalidateQueries(['userProfile']);
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error(error.response?.data?.message || 'Failed to purchase pass');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUsePass = async () => {
        if (timeTravelPasses <= 0) {
            toast.error('No Time Travel Passes available!');
            return;
        }

        setIsLoading(true);
        try {
            const token = await getToken();

            await axiosInstance.post('/users/restore-streak', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Streak restored successfully!');
            queryClient.invalidateQueries(['userProfile']);
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Restore error:', error);
            toast.error(error.response?.data?.message || 'Failed to restore streak');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header with gradient */}
                <div className="bg-gradient-to-br from-base-300 to-base-200 px-6 py-8 text-center">
                    {/* Hexagon badge */}
                    <div className="w-24 h-24 mx-auto mb-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl rotate-45 transform scale-75"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-base-content mb-1">
                        Travel Back in Time to
                    </h2>
                    <h3 className="text-2xl font-bold text-base-content">
                        Finish <span className="text-amber-400">1</span> Missing Challenge
                    </h3>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Tab buttons */}
                    {timeTravelPasses > 0 && (
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setMode('purchase')}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'purchase'
                                        ? 'bg-primary text-primary-content'
                                        : 'bg-base-200 text-base-content/60'
                                    }`}
                            >
                                Buy New Pass
                            </button>
                            <button
                                onClick={() => setMode('use')}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'use'
                                        ? 'bg-primary text-primary-content'
                                        : 'bg-base-200 text-base-content/60'
                                    }`}
                            >
                                Use Pass ({timeTravelPasses})
                            </button>
                        </div>
                    )}

                    {mode === 'purchase' ? (
                        <>
                            <p className="text-base-content text-center">
                                Are you sure you want to redeem a <span className="font-bold">Time Travel Ticket</span>
                                <br />
                                for <span className="text-amber-500 font-bold">{PASS_COST}</span> LeetCoins?
                            </p>

                            <div className="space-y-2 text-sm text-base-content/70">
                                <p>Tickets make up any invalid or late submission for all problems.</p>
                                <p>Tickets are only valid through the end of the month in which they are redeemed.</p>
                                <p>The redeem cycle ends at 23:00 on the last day of the month. Both times are based on UTC.</p>
                                <p>You may purchase up to 3 tickets per redeem cycle.</p>
                            </div>

                            <div className="text-center text-sm text-base-content/50">
                                Your balance: <span className="font-bold text-primary">{userCoins}</span> coins
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-base-content text-center">
                                Use one of your <span className="font-bold text-emerald-400">{timeTravelPasses}</span> Time Travel Passes
                                <br />
                                to restore your streak?
                            </p>

                            <div className="bg-base-200 rounded-lg p-4 text-center">
                                <p className="text-sm text-base-content/70">
                                    This will restore your streak and set your last solved date to yesterday.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 pt-0">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="btn btn-ghost flex-1"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={mode === 'purchase' ? handlePurchase : handleUsePass}
                        disabled={isLoading || (mode === 'purchase' && userCoins < PASS_COST)}
                        className="btn btn-warning flex-1 gap-2"
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <>
                                {mode === 'purchase' ? 'Redeem' : 'Use Pass'}
                                <GiftIcon className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TimeTravelModal;
