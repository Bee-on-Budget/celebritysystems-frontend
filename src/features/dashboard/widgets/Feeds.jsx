import React, { useEffect, useMemo, useState } from 'react';
import { FaTasks, FaShoppingCart, FaClock, FaPen } from 'react-icons/fa';
import { formatRelativeTime } from '../../../utils/timeUtils';
import { getDailyActivity } from '../../../api/services/ReportingService';
import { useTranslation } from 'react-i18next';

const FeedItem = ({ type, message, time }) => {    // Define icon and color based on type
    const feedTypes = {
        task: {
            icon: <FaTasks />,
            bgColor: 'bg-green-500',
        },
        order: {
            icon: <FaShoppingCart />,
            bgColor: 'bg-red-500',
        },
        pending: {
            icon: <FaClock />,
            bgColor: 'bg-blue-500',
        },
        update: {
            icon: <FaPen />,
            bgColor: 'bg-yellow-500',
        },
    };

    const currentType = feedTypes[type] || feedTypes.task; // Default to task if type is invalid

    return (
        <li className="flex items-center justify-between text-sm py-2">
            <div className="flex items-center gap-3">
                <div className={`${currentType.bgColor} rounded-full p-2 text-white`}>
                    {currentType.icon}
                </div>
                <span>{message}</span>
            </div>
            <span className="text-gray-400 whitespace-nowrap">
                {formatRelativeTime(time)}
            </span>
        </li>
    );
};

const Feeds = ({ items = [], title, startDate, endDate }) => {
    const { t } = useTranslation();
    const [activity, setActivity] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                if (!startDate || !endDate) return;
                const data = await getDailyActivity({ startDate, endDate });
                setActivity(data);
            } catch (err) {
                setError(err?.message || 'Failed to load activity');
            }
        };
        fetchActivity();
    }, [startDate, endDate]);

    const feedItems = useMemo(() => {
        const base = [];
        if (activity?.dailyStats?.length) {
            activity.dailyStats.forEach((day) => {
                const dayDate = day.date;
                if (day.usersCreated > 0) {
                    base.push({ type: 'update', message: t('dashboard.feeds.usersCreated', { count: day.usersCreated }), time: dayDate });
                }
                if (day.companiesCreated > 0) {
                    base.push({ type: 'order', message: t('dashboard.feeds.companiesCreated', { count: day.companiesCreated }), time: dayDate });
                }
                if (day.contractsCreated > 0) {
                    base.push({ type: 'task', message: t('dashboard.feeds.contractsCreated', { count: day.contractsCreated }), time: dayDate });
                }
                if (day.ticketsCreated > 0) {
                    base.push({ type: 'pending', message: t('dashboard.feeds.ticketsCreated', { count: day.ticketsCreated }), time: dayDate });
                }
            });
        }
        // Append any custom items provided via props
        return [...base, ...items];
    }, [activity, items, t]);

    return (
        <div className="bg-white rounded-md shadow p-4">
            <h3 className="text-lg font-semibold mb-4">{title || t('dashboard.recentActivity')}</h3>
            {error && <div className="text-sm text-red-500 mb-2">{t('dashboard.feeds.failedLoadActivity')}</div>}
            <ul className="space-y-2">
                {feedItems.length === 0 && (
                    <li className="text-sm text-gray-500">{t('dashboard.feeds.noActivity')}</li>
                )}
                {feedItems.map((item, index) => (
                    <FeedItem
                        key={index}
                        type={item.type}
                        message={item.message}
                        time={item.time}
                    />
                ))}
            </ul>
        </div>
    );
};

export default Feeds;
