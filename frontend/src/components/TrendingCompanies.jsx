import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';

/**
 * TrendingCompanies - Shows company tags with question counts
 * Features:
 * - Search filter
 * - Company pills with counts
 * - Click to navigate to filtered problems
 */
function TrendingCompanies() {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const companiesPerPage = 15;

    // Fetch company stats
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axiosInstance.get('/problems/stats/companies');
                setCompanies(response.data.companies || []);
            } catch (error) {
                console.error('Failed to fetch company stats:', error);
                setCompanies([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    // Filter companies by search
    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Paginate
    const paginatedCompanies = filteredCompanies.slice(
        page * companiesPerPage,
        (page + 1) * companiesPerPage
    );

    const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

    // Handle company click
    const handleCompanyClick = (companyName) => {
        navigate(`/problems?company=${encodeURIComponent(companyName)}`);
    };

    // Get color based on count (higher = more orange)
    const getCountColor = (count) => {
        if (count >= 1000) return 'bg-orange-500 text-white';
        if (count >= 500) return 'bg-amber-500 text-white';
        if (count >= 100) return 'bg-amber-400/80 text-base-900';
        return 'bg-amber-400/60 text-base-900';
    };

    if (isLoading) {
        return (
            <div className="bg-base-200/50 rounded-2xl p-4 border border-base-300/50">
                <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-base-300 rounded w-1/2"></div>
                    <div className="h-10 bg-base-300 rounded"></div>
                    <div className="flex flex-wrap gap-2">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-8 bg-base-300 rounded-full w-24"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-base-200/50 rounded-2xl p-4 border border-base-300/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base-content font-semibold">Trending Companies</h3>
                <div className="flex gap-1">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="btn btn-xs btn-ghost text-base-content/50 hover:text-base-content disabled:opacity-30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="btn btn-xs btn-ghost text-base-content/50 hover:text-base-content disabled:opacity-30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Search input */}
            <div className="relative mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search for a company..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(0);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-base-300/50 border border-base-300 rounded-xl text-sm text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary/50 transition-colors"
                />
            </div>

            {/* Company tags */}
            <div className="flex flex-wrap gap-2">
                {paginatedCompanies.length === 0 ? (
                    <p className="text-sm text-base-content/50">No companies found</p>
                ) : (
                    paginatedCompanies.map((company) => (
                        <button
                            key={company.name}
                            onClick={() => handleCompanyClick(company.name)}
                            className="group flex items-center gap-1.5 px-3 py-1.5 bg-base-300/40 hover:bg-base-300/70 rounded-full transition-all duration-200 border border-transparent hover:border-primary/30"
                        >
                            <span className="text-sm text-base-content/80 group-hover:text-base-content">
                                {company.name}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getCountColor(company.count)}`}>
                                {company.count}
                            </span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

export default TrendingCompanies;
