"use server";

import { AnalyticsEvent, UserProfile } from "@/lib/models";
import sequelize from "@/lib/db";
import { Op } from "sequelize";

export async function trackEvent(profileId: string, eventType: string, eventData: any = {}, visitorId?: string) {
    try {
        await AnalyticsEvent.create({
            userProfileId: profileId,
            eventType,
            eventData,
            visitorId,
        });
        return { success: true };
    } catch (error: any) {
        console.error("Error tracking event:", error);
        return { success: false, error: error.message };
    }
}

export async function getAnalytics(profileId: string, periodDays: number = 30) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodDays);

        // 1. Profile Views (Line Chart Data)
        // Group by Date
        const views = await AnalyticsEvent.findAll({
            where: {
                userProfileId: profileId,
                eventType: 'VIEW',
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('visitorId'))), 'unique_visitors'],
            ],
            group: ['date'],
            order: [['date', 'ASC']],
            raw: true,
        });

        // 2. Engagement Actions (Bar Chart Data)
        // Group by sub-type inside eventData or just by eventType if distinct enough
        const clickEvents = await AnalyticsEvent.findAll({
            where: {
                userProfileId: profileId,
                eventType: {
                    [Op.in]: ['CLICK_CONTACT', 'CLICK_SOCIAL', 'CLICK_LINK'],
                },
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
            raw: true,
        });

        // 3. Product Clicks
        const productClicks = await AnalyticsEvent.findAll({
            where: {
                userProfileId: profileId,
                eventType: 'CLICK_PRODUCT',
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
            raw: true,
        });

        // 4. Shares
        const shares = await AnalyticsEvent.count({
            where: {
                userProfileId: profileId,
                eventType: 'SHARE',
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });

        // Process data for charts
        // ... (We will refine processing logic as we build the UI consumption)

        return {
            success: true,
            data: {
                views,
                clickEvents,
                productClicks,
                shares
            }
        };

    } catch (error: any) {
        console.error("Error fetching analytics:", error);
        return { success: false, error: error.message };
    }
}
