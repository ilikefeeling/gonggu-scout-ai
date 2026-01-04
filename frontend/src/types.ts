export interface Influencer {
    id: number;
    username: string;
    displayName: string;
    categoryTag: string;
    followerCount: number;
    avgReelsView: number;
    engagementRate: number;
    lastGongguDate: string | null;
    salesFatigueScore: number;
    bioLinkUrl: string | null;
    hasActiveLink: boolean;
    profileImageUrl: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SearchFilters {
    category: string;
    minFollowers: number;
    maxFollowers: number;
    minReelsView: number;
    maxReelsView: number;
    sortBy: 'engagement' | 'followers' | 'recent';
}
