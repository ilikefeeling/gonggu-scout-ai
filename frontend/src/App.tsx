import { useState, useEffect } from 'react';
import { Influencer, SearchFilters } from './types';
import SearchFiltersComponent from './components/SearchFilters';
import ResultsList from './components/ResultsList';
import InfluencerDetail from './components/InfluencerDetail';
import './App.css';

function App() {
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
    const [filters, setFilters] = useState<SearchFilters>({
        category: 'all',
        minFollowers: 5000,
        maxFollowers: 500000,
        minReelsView: 0,
        maxReelsView: 200000,
        sortBy: 'engagement',
    });

    // Fetch influencers based on filters
    useEffect(() => {
        fetchInfluencers();
    }, [filters]);

    const fetchInfluencers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            if (filters.category !== 'all') {
                params.append('category', filters.category);
            }
            params.append('minFollowers', filters.minFollowers.toString());
            params.append('maxFollowers', filters.maxFollowers.toString());
            params.append('minReelsView', filters.minReelsView.toString());
            params.append('maxReelsView', filters.maxReelsView.toString());
            params.append('sortBy', filters.sortBy);

            const response = await fetch(`/api/influencers?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setInfluencers(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch influencers:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="container">
                    <h1 className="app-title">
                        <span className="text-gradient">Gong-gu Scout AI</span>
                    </h1>
                    <p className="app-subtitle">
                        진짜 도달률로 찾는 공구 최적화 인플루언서 발굴 솔루션
                    </p>
                </div>
            </header>

            <main className="app-main">
                <div className="container">
                    <SearchFiltersComponent
                        filters={filters}
                        onFiltersChange={setFilters}
                    />

                    <div className="results-header">
                        <h2>검색 결과</h2>
                        <span className="results-count">
                            {loading ? '검색 중...' : `${influencers.length}명의 인플루언서`}
                        </span>
                    </div>

                    <ResultsList
                        influencers={influencers}
                        loading={loading}
                        onSelectInfluencer={setSelectedInfluencer}
                    />
                </div>
            </main>

            {selectedInfluencer && (
                <InfluencerDetail
                    influencer={selectedInfluencer}
                    onClose={() => setSelectedInfluencer(null)}
                />
            )}
        </div>
    );
}

export default App;
