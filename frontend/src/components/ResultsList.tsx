import { Influencer } from '../types';
import InfluencerCard from './InfluencerCard';
import './ResultsList.css';

interface ResultsListProps {
    influencers: Influencer[];
    loading: boolean;
    onSelectInfluencer: (influencer: Influencer) => void;
}

function ResultsList({ influencers, loading, onSelectInfluencer }: ResultsListProps) {
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">인플루언서 검색 중...</p>
            </div>
        );
    }

    if (influencers.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>검색 결과가 없습니다</h3>
                <p>다른 필터 조건으로 시도해보세요</p>
            </div>
        );
    }

    return (
        <div className="results-grid">
            {influencers.map((influencer, index) => (
                <div
                    key={influencer.id}
                    className="result-item"
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <InfluencerCard
                        influencer={influencer}
                        onClick={() => onSelectInfluencer(influencer)}
                    />
                </div>
            ))}
        </div>
    );
}

export default ResultsList;
