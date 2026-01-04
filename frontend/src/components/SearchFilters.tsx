import { SearchFilters as SearchFiltersType } from '../types';
import './SearchFilters.css';

interface SearchFiltersProps {
    filters: SearchFiltersType;
    onFiltersChange: (filters: SearchFiltersType) => void;
}

const CATEGORIES = [
    { value: 'all', label: '전체 카테고리' },
    { value: '뷰티', label: '뷰티' },
    { value: '패션', label: '패션 및 스타일' },
    { value: '건강/웰니스', label: '건강 및 웰니스' },
    { value: '음식', label: '음식 및 음료' },
    { value: '홈/리빙', label: '홈 및 인테리어' },
    { value: '육아', label: '육아 및 가족' },
    { value: '여행', label: '여행' },
    { value: '스포츠', label: '스포츠 및 피트니스' },
    { value: '사진/영상', label: '사진 및 비디오' },
    { value: '비즈니스', label: '비즈니스 및 창업' },
    { value: '교육', label: '교육' },
    { value: '엔터테인먼트', label: '엔터테인먼트' },
    { value: '반려동물', label: '반려동물' },
    { value: '자동차', label: '자동차' },
    { value: '게임', label: '게임' },
];

// API base URL - use environment variable or default to local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFiltersChange({ ...filters, category: e.target.value });
    };

    const handleFollowerChange = (type: 'min' | 'max', value: number) => {
        if (type === 'min') {
            onFiltersChange({ ...filters, minFollowers: value });
        } else {
            onFiltersChange({ ...filters, maxFollowers: value });
        }
    };

    const handleReelsViewChange = (type: 'min' | 'max', value: number) => {
        if (type === 'min') {
            onFiltersChange({ ...filters, minReelsView: value });
        } else {
            onFiltersChange({ ...filters, maxReelsView: value });
        }
    };

    const handleSortChange = (sortBy: SearchFiltersType['sortBy']) => {
        onFiltersChange({ ...filters, sortBy });
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
        return num.toString();
    };

    return (
        <div className="search-filters glass-card">
            <h3 className="filters-title">🔍 검색 필터</h3>

            <div className="filters-grid">
                {/* Category Filter */}
                <div className="filter-group">
                    <label className="filter-label">전문 분야</label>
                    <select
                        className="filter-select"
                        value={filters.category}
                        onChange={handleCategoryChange}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Follower Count Range */}
                <div className="filter-group">
                    <label className="filter-label">
                        팔로워 수: {formatNumber(filters.minFollowers)} - {formatNumber(filters.maxFollowers)}
                    </label>
                    <div className="range-inputs">
                        <input
                            type="range"
                            min="1000"
                            max="1000000"
                            step="1000"
                            value={filters.minFollowers}
                            onChange={(e) => handleFollowerChange('min', parseInt(e.target.value))}
                        />
                        <input
                            type="range"
                            min="1000"
                            max="1000000"
                            step="1000"
                            value={filters.maxFollowers}
                            onChange={(e) => handleFollowerChange('max', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                {/* Reels View Count Range */}
                <div className="filter-group">
                    <label className="filter-label">
                        평균 릴스 조회수: {formatNumber(filters.minReelsView)} - {formatNumber(filters.maxReelsView)}
                    </label>
                    <div className="range-inputs">
                        <input
                            type="range"
                            min="0"
                            max="500000"
                            step="5000"
                            value={filters.minReelsView}
                            onChange={(e) => handleReelsViewChange('min', parseInt(e.target.value))}
                        />
                        <input
                            type="range"
                            min="0"
                            max="500000"
                            step="5000"
                            value={filters.maxReelsView}
                            onChange={(e) => handleReelsViewChange('max', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                {/* Sort Options */}
                <div className="filter-group">
                    <label className="filter-label">정렬 기준</label>
                    <div className="sort-buttons">
                        <button
                            className={`btn-sort ${filters.sortBy === 'engagement' ? 'active' : ''}`}
                            onClick={() => handleSortChange('engagement')}
                        >
                            참여율
                        </button>
                        <button
                            className={`btn-sort ${filters.sortBy === 'followers' ? 'active' : ''}`}
                            onClick={() => handleSortChange('followers')}
                        >
                            팔로워
                        </button>
                        <button
                            className={`btn-sort ${filters.sortBy === 'recent' ? 'active' : ''}`}
                            onClick={() => handleSortChange('recent')}
                        >
                            최근 공구
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { API_URL };
export default SearchFilters;
