import { Influencer } from '../types';
import './InfluencerDetail.css';

interface InfluencerDetailProps {
    influencer: Influencer;
    onClose: () => void;
}

function InfluencerDetail({ influencer, onClose }: InfluencerDetailProps) {
    const formatNumber = (num: number): string => {
        return num.toLocaleString('ko-KR');
    };

    const formatDate = (dateString: string | null): string => {
        if (!dateString) return '없음';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getFatigueInfo = () => {
        const score = influencer.salesFatigueScore;
        if (score <= 3) {
            return {
                label: '신선함 (최적)',
                color: 'var(--color-green)',
                desc: '월 2회 이하의 공구로 청중 피로도가 낮습니다. 구매력이 높을 가능성이 큽니다.',
            };
        }
        if (score <= 6) {
            return {
                label: '보통',
                color: 'var(--color-yellow)',
                desc: '주 1회 수준의 공구 빈도입니다. 적절한 판매 활동을 유지하고 있습니다.',
            };
        }
        return {
            label: '높음 (주의)',
            color: 'var(--color-red)',
            desc: '주 3회 이상의 높은 판매 빈도로 청중 피로도가 높을 수 있습니다.',
        };
    };

    const fatigueInfo = getFatigueInfo();

    return (
        <div className="detail-overlay" onClick={onClose}>
            <div className="detail-modal glass-card" onClick={(e) => e.stopPropagation()}>
                <button className="btn-close" onClick={onClose}>✕</button>

                <div className="detail-header">
                    <div className="detail-profile">
                        {influencer.profileImageUrl ? (
                            <img
                                src={influencer.profileImageUrl}
                                alt={influencer.username}
                                className="detail-avatar"
                            />
                        ) : (
                            <div className="detail-avatar-placeholder">
                                {influencer.displayName.charAt(0)}
                            </div>
                        )}
                        <div className="detail-profile-info">
                            <h2>{influencer.displayName}</h2>
                            <p className="detail-username">@{influencer.username}</p>
                            <span className="badge badge-category">{influencer.categoryTag}</span>
                        </div>
                    </div>
                    {influencer.bio && (
                        <p className="detail-bio">{influencer.bio}</p>
                    )}
                </div>

                <div className="detail-body">
                    {/* Metrics Section */}
                    <div className="detail-section">
                        <h3 className="section-title">📊 주요 지표</h3>
                        <div className="metrics-detailed">
                            <div className="metric-detailed">
                                <span className="metric-detailed-label">팔로워 수</span>
                                <span className="metric-detailed-value">
                                    {formatNumber(influencer.followerCount)}
                                </span>
                            </div>
                            <div className="metric-detailed">
                                <span className="metric-detailed-label">평균 릴스 조회수</span>
                                <span className="metric-detailed-value">
                                    {formatNumber(influencer.avgReelsView)}
                                </span>
                            </div>
                            <div className="metric-detailed">
                                <span className="metric-detailed-label">참여율 (ER)</span>
                                <span className="metric-detailed-value">
                                    {influencer.engagementRate.toFixed(2)}%
                                </span>
                            </div>
                            <div className="metric-detailed">
                                <span className="metric-detailed-label">도달률</span>
                                <span className="metric-detailed-value">
                                    {((influencer.avgReelsView / influencer.followerCount) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Gonggu Activity Section */}
                    <div className="detail-section">
                        <h3 className="section-title">🛒 공구 활동성</h3>
                        <div className="activity-grid">
                            <div className="activity-item">
                                <span className="activity-label">최근 공구 일자</span>
                                <span className="activity-value">
                                    {formatDate(influencer.lastGongguDate)}
                                </span>
                            </div>
                            <div className="activity-item">
                                <span className="activity-label">판매 링크</span>
                                <span className="activity-value">
                                    {influencer.hasActiveLink ? (
                                        <a
                                            href={influencer.bioLinkUrl || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-active"
                                        >
                                            활성 🔗
                                        </a>
                                    ) : (
                                        <span className="link-inactive">비활성</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sales Fatigue Analysis */}
                    <div className="detail-section">
                        <h3 className="section-title">⚡ 판매 피로도 분석</h3>
                        <div className="fatigue-analysis">
                            <div className="fatigue-score" style={{ borderColor: fatigueInfo.color }}>
                                <span className="fatigue-score-value" style={{ color: fatigueInfo.color }}>
                                    {influencer.salesFatigueScore}/10
                                </span>
                                <span className="fatigue-score-label">{fatigueInfo.label}</span>
                            </div>
                            <p className="fatigue-description">{fatigueInfo.desc}</p>
                        </div>
                    </div>

                    {/* ROI Potential (Placeholder) */}
                    <div className="detail-section">
                        <h3 className="section-title">💰 예상 수익성</h3>
                        <div className="roi-placeholder">
                            <p>Phase 2에서 수익 시뮬레이터 기능이 추가될 예정입니다.</p>
                            <p className="roi-hint">
                                현재 참여율 {influencer.engagementRate.toFixed(1)}%는
                                {influencer.engagementRate > 5 ? ' 높은' : ' 보통'} 수준입니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="detail-footer">
                    <button className="btn btn-primary">
                        제안서 생성 (준비 중)
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InfluencerDetail;
