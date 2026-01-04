import { Influencer } from '../types';
import './InfluencerCard.css';

interface InfluencerCardProps {
    influencer: Influencer;
    onClick: () => void;
}

function InfluencerCard({ influencer, onClick }: InfluencerCardProps) {
    // Calculate D-Day since last gonggu
    const getDDay = (): string => {
        if (!influencer.lastGongguDate) return '공구 이력 없음';

        const lastDate = new Date(influencer.lastGongguDate);
        const today = new Date();
        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '오늘';
        if (diffDays === 1) return '어제';
        return `${diffDays}일 전`;
    };

    // Get fatigue badge class
    const getFatigueBadgeClass = (): string => {
        if (influencer.salesFatigueScore <= 3) return 'badge-fatigue-green';
        if (influencer.salesFatigueScore <= 6) return 'badge-fatigue-yellow';
        return 'badge-fatigue-red';
    };

    // Get fatigue label
    const getFatigueLabel = (): string => {
        if (influencer.salesFatigueScore <= 3) return '🟢 신선함';
        if (influencer.salesFatigueScore <= 6) return '🟡 보통';
        return '🔴 높음';
    };

    // Format number with K/M suffix
    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <div className="influencer-card glass-card" onClick={onClick}>
            <div className="card-header">
                <div className="profile-section">
                    <div className="profile-avatar">
                        {influencer.profileImageUrl ? (
                            <img src={influencer.profileImageUrl} alt={influencer.username} />
                        ) : (
                            <div className="avatar-placeholder">
                                {influencer.displayName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h4 className="profile-name">{influencer.displayName}</h4>
                        <p className="profile-username">@{influencer.username}</p>
                    </div>
                </div>
                <span className={`badge badge-category`}>
                    {influencer.categoryTag}
                </span>
            </div>

            <div className="card-body">
                <div className="metrics-grid">
                    <div className="metric">
                        <span className="metric-label">팔로워</span>
                        <span className="metric-value">{formatNumber(influencer.followerCount)}</span>
                    </div>
                    <div className="metric">
                        <span className="metric-label">평균 조회수</span>
                        <span className="metric-value">{formatNumber(influencer.avgReelsView)}</span>
                    </div>
                    <div className="metric">
                        <span className="metric-label">참여율</span>
                        <span className="metric-value">{influencer.engagementRate.toFixed(1)}%</span>
                    </div>
                </div>

                <div className="gonggu-info">
                    <div className="gonggu-row">
                        <span className="gonggu-label">최근 공구</span>
                        <span className="gonggu-value">{getDDay()}</span>
                    </div>
                    <div className="gonggu-row">
                        <span className="gonggu-label">판매 피로도</span>
                        <span className={`badge ${getFatigueBadgeClass()}`}>
                            {getFatigueLabel()}
                        </span>
                    </div>
                    {influencer.hasActiveLink && (
                        <div className="gonggu-row">
                            <span className="link-indicator">🔗 활성 링크</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="card-footer">
                <button className="btn-view-detail">상세 보기 →</button>
            </div>
        </div>
    );
}

export default InfluencerCard;
