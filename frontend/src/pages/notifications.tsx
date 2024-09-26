import { useEffect, useState } from 'react';

interface Notification {
    message: string;
    createdAt: Date;
}

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:8082/notifications');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
                setError('Failed to fetch notifications. Please try again later.');
            }
        };
        fetchNotifications();
    }, []);

    return (
        <div>
            <h1>Notifications</h1>
            {error && <p>{error}</p>}
            {notifications.length === 0 ? (
                <p>No notifications available.</p>
            ) : (
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>
                            {notification.message} <br />
                            <small>{new Date(notification.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationsPage;
