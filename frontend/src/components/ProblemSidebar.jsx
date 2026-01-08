import { useState } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, CalendarIcon } from 'lucide-react';
import StreakCalendar from './StreakCalendar';
import WeeklyProgress from './WeeklyProgress';
import TrendingCompanies from './TrendingCompanies';

/**
 * ProblemSidebar - Fixed floating sidebar on right edge
 * Visible by default with toggle to hide
 */
function ProblemSidebar({
    streak = 0,
    lastSolvedDate,
    coins = 0,
    timeTravelPasses = 0,
    streakHistory = [],
    activeTimeTravelDate,
    onPassUsed
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            {/* Toggle button - always visible on left edge of sidebar */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`
                    fixed z-50 top-1/2 -translate-y-1/2 
                    w-6 h-20 bg-base-200 hover:bg-base-300 
                    rounded-l-lg border border-r-0 border-base-300
                    flex items-center justify-center
                    transition-all duration-300 shadow-lg
                    ${isCollapsed ? 'right-0' : 'right-80'}
                `}
                title={isCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            >
                {isCollapsed ? (
                    <ChevronLeftIcon className="w-4 h-4 text-base-content/60" />
                ) : (
                    <ChevronRightIcon className="w-4 h-4 text-base-content/60" />
                )}
            </button>

            {/* Sidebar panel - fixed to right edge */}
            <div className={`
                fixed top-16 right-0 h-[calc(100vh-64px)] w-80
                bg-base-100/95 backdrop-blur-md border-l border-base-300/50
                overflow-y-auto z-40 shadow-2xl
                transition-transform duration-300 ease-in-out
                ${isCollapsed ? 'translate-x-full' : 'translate-x-0'}
            `}>
                <div className="p-4 space-y-4">
                    {/* Section header */}
                    <div className="flex items-center gap-2 text-base-content/60">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Daily Challenge</span>
                    </div>

                    {/* Streak Calendar */}
                    <StreakCalendar
                        streak={streak}
                        lastSolvedDate={lastSolvedDate}
                        streakHistory={streakHistory}
                        timeTravelPasses={timeTravelPasses}
                        activeTimeTravelDate={activeTimeTravelDate}
                    />

                    {/* Weekly Progress */}
                    <WeeklyProgress
                        streak={streak}
                        coins={coins}
                        timeTravelPasses={timeTravelPasses}
                        onPassUsed={onPassUsed}
                    />

                    {/* Divider */}
                    <div className="border-t border-base-300/50 my-4"></div>

                    {/* Trending Companies */}
                    <TrendingCompanies />
                </div>
            </div>
        </>
    );
}

export default ProblemSidebar;
