import React from 'react';
import { FaTasks, FaShoppingCart, FaClock } from 'react-icons/fa';
import { formatRelativeTime } from '../../../utils/timeUtils';

const FeedItem = ({ type, message, time }) => {
    // Define icon and color based on type
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

const Feeds = ({ items = [], title = 'Feeds' }) => {
    return (
        <div className="bg-white rounded-md shadow p-4">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <ul className="space-y-2">
                {items.map((item, index) => (
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
