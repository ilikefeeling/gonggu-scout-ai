import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Instagram-style categories for group buying
const categories = [
    '뷰티',
    '패션',
    '건강/웰니스',
    '음식',
    '홈/리빙',
    '육아',
    '여행',
    '스포츠',
    '사진/영상',
    '비즈니스',
    '교육',
    '엔터테인먼트',
    '반려동물',
    '자동차',
    '게임',
];

const koreanNames = [
    '민지맘', '서현언니', '지우쌤', '유진_daily', '수영맘', '하늘이네',
    '준호파파', '은지_life', '소라맘', '지혜언니', '태희_cook', '예진_fit',
    '현우_tech', '미나_beauty', '승민맘', '지원_style', '도윤이네', '채원언니',
    '서준파파', '아라_lifestyle', '민서맘', '정우_gym', '혜진_kitchen', '다은_kids',
    '시우맘', '유나_fashion', '재윤이네', '서연_cosmetic', '동현_gadget', '수빈맘',
    '예은_travel', '준서_sports', '하은_pet', '지훈_car', '수아_game',
    '윤서_photo', '민준_business', '서아_education', '지안_entertainment', '하윤_wellness',
];

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function randomDate(daysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - randomInt(1, daysAgo));
    return date;
}

function calculateFatigueScore(lastGongguDate: Date | null): number {
    if (!lastGongguDate) return 1;

    const daysSince = Math.floor(
        (new Date().getTime() - lastGongguDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince > 30) return randomInt(1, 3); // Green: 신선함
    if (daysSince > 14) return randomInt(4, 6); // Yellow: 보통
    return randomInt(7, 10); // Red: 높은 피로도
}

async function main() {
    console.log('🌱 Seeding database with Instagram-style influencer data...');

    // Clear existing data
    await prisma.influencer.deleteMany();

    const influencers = [];

    // Create more diverse influencer profiles (60 total, ~4 per category)
    for (let i = 0; i < 60; i++) {
        const category = categories[i % categories.length];
        const username = koreanNames[i % koreanNames.length] + (i >= koreanNames.length ? `_${Math.floor(i / koreanNames.length)}` : '');
        const followerCount = randomInt(5000, 300000);
        const avgReelsView = Math.floor(followerCount * randomFloat(0.05, 0.3)); // 5-30% of followers
        const engagementRate = randomFloat(2.5, 12.0); // 2.5% - 12%
        const hasGonggu = Math.random() > 0.2; // 80% have done gonggu
        const lastGongguDate = hasGonggu ? randomDate(60) : null;
        const salesFatigueScore = calculateFatigueScore(lastGongguDate);
        const hasActiveLink = Math.random() > 0.3;

        influencers.push({
            username,
            displayName: username.replace('_', ' '),
            categoryTag: category,
            followerCount,
            avgReelsView,
            engagementRate: parseFloat(engagementRate.toFixed(2)),
            lastGongguDate,
            salesFatigueScore,
            bioLinkUrl: hasActiveLink ? `https://link.example.com/${username}` : null,
            hasActiveLink,
            profileImageUrl: `https://i.pravatar.cc/150?u=${username}`,
            bio: `${category} 전문 인플루언서 | 진솔한 후기와 추천만 합니다 ✨`,
        });
    }

    await prisma.influencer.createMany({
        data: influencers,
    });

    console.log(`✅ Created ${influencers.length} influencer profiles`);

    // Display summary by category
    console.log('\n📊 카테고리별 분포:');
    for (const category of categories) {
        const count = await prisma.influencer.count({
            where: { categoryTag: category },
        });
        console.log(`   - ${category}: ${count} influencers`);
    }
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
