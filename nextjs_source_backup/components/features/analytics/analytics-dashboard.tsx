"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "@/lib/actions/analytics-actions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import { Loader2, TrendingUp, TrendingDown, Eye, MousePointerClick, Share2, ShoppingBag } from "lucide-react";
import { format, subDays } from "date-fns";

interface AnalyticsDashboardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profileId: string;
}

export function AnalyticsDashboard({ open, onOpenChange, profileId }: AnalyticsDashboardProps) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [period, setPeriod] = useState(30);

    useEffect(() => {
        if (open) {
            fetchAnalytics();
        }
    }, [open, period, profileId]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const result = await getAnalytics(profileId, period);
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // calculate total views
    const totalViews = data?.views?.reduce((sum: number, item: any) => sum + Number(item.count), 0) || 0;
    const uniqueVisitors = data?.views?.reduce((sum: number, item: any) => sum + Number(item.unique_visitors), 0) || 0;
    const totalShares = data?.shares || 0;

    // Process Engagement Data for Bar Chart
    const engagementMap = {
        'CLICK_CONTACT': 0,
        'CLICK_SOCIAL': 0,
        'CLICK_LINK': 0
    };

    data?.clickEvents?.forEach((event: any) => {
        if (engagementMap[event.eventType as keyof typeof engagementMap] !== undefined) {
            engagementMap[event.eventType as keyof typeof engagementMap]++;
        }
    });

    const engagementData = [
        { name: 'Contact', count: engagementMap['CLICK_CONTACT'] },
        { name: 'Socials', count: engagementMap['CLICK_SOCIAL'] },
        { name: 'Links', count: engagementMap['CLICK_LINK'] },
    ];

    // Process Product Data
    const productMap = new Map();
    data?.productClicks?.forEach((event: any) => {
        const name = event.eventData?.name || 'Unknown Product';
        productMap.set(name, (productMap.get(name) || 0) + 1);
    });

    const productData = Array.from(productMap.entries()).map(([name, count]) => ({ name, count }));


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold">Profile Analytics</DialogTitle>
                    <DialogDescription>
                        Insights for the last {period} days
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatsCard
                                title="Total Views"
                                value={totalViews}
                                icon={<Eye className="w-5 h-5 text-blue-600" />}
                                subtext={`${uniqueVisitors} unique visitors`}
                            />
                            <StatsCard
                                title="Engagement"
                                value={data?.clickEvents?.length || 0}
                                icon={<MousePointerClick className="w-5 h-5 text-purple-600" />}
                                subtext="Total clicks"
                            />
                            <StatsCard
                                title="Product Interest"
                                value={data?.productClicks?.length || 0}
                                icon={<ShoppingBag className="w-5 h-5 text-pink-600" />}
                                subtext="Product clicks"
                            />
                            <StatsCard
                                title="Shares"
                                value={totalShares}
                                icon={<Share2 className="w-5 h-5 text-green-600" />}
                                subtext="Profile shares"
                            />
                        </div>

                        {/* Views Chart */}
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                            <h3 className="text-lg font-semibold mb-6">Profile Views Trend</h3>
                            <div className="h-[300px] w-full" style={{ minHeight: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data?.views}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(date) => format(new Date(date), 'MMM d')}
                                            stroke="#9CA3AF"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#9CA3AF"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            labelStyle={{ color: '#6B7280' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#2563EB"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }}
                                            activeDot={{ r: 6 }}
                                            name="Views"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="unique_visitors"
                                            stroke="#9333EA"
                                            strokeWidth={2}
                                            dot={false}
                                            strokeDasharray="5 5"
                                            name="Unique Visitors"
                                        />
                                        <Legend />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Engagement Chart */}
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                                <h3 className="text-lg font-semibold mb-6">Engagement Actions</h3>
                                <div className="h-[250px] w-full" style={{ minHeight: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={engagementData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Product Clicks Chart */}
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                                <h3 className="text-lg font-semibold mb-6">Top Products</h3>
                                {productData.length > 0 ? (
                                    <div className="h-[250px] w-full" style={{ minHeight: '250px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={productData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                                <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                                <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                <Bar dataKey="count" fill="#EC4899" radius={[0, 4, 4, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-[250px] flex items-center justify-center text-gray-400">
                                        No product clicks yet
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function StatsCard({ title, value, icon, subtext }: { title: string, value: number, icon: any, subtext: string }) {
    return (
        <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 md:p-5 rounded-2xl border border-gray-100 dark:border-zinc-700/50">
            <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 font-medium text-sm">{title}</span>
                <div className="p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
                    {icon}
                </div>
            </div>
            <div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
                <p className="text-xs text-gray-400 mt-1">{subtext}</p>
            </div>
        </div>
    );
}
