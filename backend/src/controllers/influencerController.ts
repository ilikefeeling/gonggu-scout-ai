import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Search influencers with multi-criteria filtering
 * Query params:
 * - category: string (육아, 주방/리빙, etc.)
 * - minFollowers: number
 * - maxFollowers: number
 * - minReelsView: number
 * - maxReelsView: number
 * - sortBy: string (engagement | followers | recent)
 */
export async function searchInfluencers(req: Request, res: Response) {
    try {
        const {
            category,
            minFollowers,
            maxFollowers,
            minReelsView,
            maxReelsView,
            sortBy = 'engagement'
        } = req.query;

        // Build filter conditions
        const where: any = {};

        if (category && category !== 'all') {
            where.categoryTag = category;
        }

        if (minFollowers || maxFollowers) {
            where.followerCount = {};
            if (minFollowers) where.followerCount.gte = parseInt(minFollowers as string);
            if (maxFollowers) where.followerCount.lte = parseInt(maxFollowers as string);
        }

        if (minReelsView || maxReelsView) {
            where.avgReelsView = {};
            if (minReelsView) where.avgReelsView.gte = parseInt(minReelsView as string);
            if (maxReelsView) where.avgReelsView.lte = parseInt(maxReelsView as string);
        }

        // Determine sort order
        let orderBy: any = {};
        switch (sortBy) {
            case 'followers':
                orderBy = { followerCount: 'desc' };
                break;
            case 'recent':
                orderBy = { lastGongguDate: 'desc' };
                break;
            case 'engagement':
            default:
                orderBy = { engagementRate: 'desc' };
                break;
        }

        const influencers = await prisma.influencer.findMany({
            where,
            orderBy,
        });

        res.json({
            success: true,
            count: influencers.length,
            data: influencers,
        });
    } catch (error) {
        console.error('Error searching influencers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search influencers',
        });
    }
}

/**
 * Get single influencer by ID
 */
export async function getInfluencerById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const influencer = await prisma.influencer.findUnique({
            where: { id: parseInt(id) },
        });

        if (!influencer) {
            return res.status(404).json({
                success: false,
                error: 'Influencer not found',
            });
        }

        res.json({
            success: true,
            data: influencer,
        });
    } catch (error) {
        console.error('Error fetching influencer:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch influencer',
        });
    }
}
