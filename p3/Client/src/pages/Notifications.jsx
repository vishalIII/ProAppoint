import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertSlice';
import axios from '../utils/axios';
import Spinner from '../pages/Spinner'; // Assuming you have a Spinner component

const Notifications = () => {
    const [showUnseen, setShowUnseen] = useState(true);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.alerts.loading);

    const toggleNotifications = () => {
        setShowUnseen(!showUnseen);
    };

    const handleRemoveAllSeenNotifications = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/remove-all-seen', { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                console.log(response.data.message);
                window.location.reload();
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log("Something went wrong", error);
        }
    };

    const handleMarkAllAsSeen = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/mark-all-as-seen', { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                console.log(response.data.message);
                window.location.reload();
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log("Something went wrong", error);
        }
    };

    // Reverse the notifications array
    const reverseNotifications = (notifications) => {
        return notifications.slice().reverse();
    };

    if (!user) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <h1 className="text-xl font-semibold">Loading...</h1>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Notifications</h1>
                {loading && <div className="text-center"><Spinner /></div>}
                <div className="flex items-center mb-4 justify-between">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={showUnseen} onChange={toggleNotifications} />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer-checked:bg-gray-800">
                            <div className="absolute top-1 left-1 bg-white border-gray-900 border rounded-full h-5 w-5 transition-transform peer-checked:translate-x-full"></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">{showUnseen ? 'Show Seen' : 'Show Unseen'}</span>
                    </label>
                    <div className="flex space-x-4">
                        {!showUnseen && (
                            <button
                                onClick={handleRemoveAllSeenNotifications}
                                className="hover:text-red-700 text-red-600 font-bold py-2 px-4 rounded underline"
                            >
                                Remove All
                            </button>
                        )}
                        {showUnseen && (
                            <button
                                onClick={handleMarkAllAsSeen}
                                className="hover:text-gray-600 text-gray-800 font-bold py-2 px-4 rounded underline"
                            >
                                Mark All
                            </button>
                        )}
                    </div>
                </div>
                <div className="overflow-hidden transition-all duration-500 ease-in-out">
                    {showUnseen ? (
                        <ul className="max-h-100 overflow-y-auto border-t border-gray-200">
                            {user.unseenNotification.length > 0 ? (
                                reverseNotifications(user.unseenNotification).map((notification, index) => (
                                    <li key={index} className="p-4 border-b border-gray-200">
                                        {notification.message}
                                    </li>
                                ))
                            ) : (
                                <li className="p-4 text-gray-600">No unseen notifications.</li>
                            )}
                        </ul>
                    ) : (
                        <ul className="max-h-100 overflow-y-auto border-t border-gray-200">
                            {user.seenNotification.length > 0 ? (
                                reverseNotifications(user.seenNotification).map((notification, index) => (
                                    <li key={index} className="p-4 border-b border-gray-200">
                                        {notification.message}
                                    </li>
                                ))
                            ) : (
                                <li className="p-4 text-gray-600">No seen notifications.</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Notifications;
