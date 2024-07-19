import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertSlice';
import { toast } from 'react-toastify'; // Ensure you have react-toastify installed

const Booking = () => {
    const { user } = useSelector((state) => state.user);
    const location = useLocation();
    const { doctor } = location.state;
    const dispatch = useDispatch();
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    const handleDateChange = (e) => {
        setAppointmentDate(e.target.value);
    };

    const handleTimeChange = (e) => {
        setAppointmentTime(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(showLoading());
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('No token found, please login.');
                return;
            }

            const response = await axios.post('/api/appointment/book', {
                DoctoruserId: doctor.userId,
                doctorId: doctor._id,
                userId: user._id,
                doctorInfo: doctor,
                userInfo: user,
                date: appointmentDate,
                time: appointmentTime,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success('Appointment booked successfully!');
            } else {
                toast.error(`Failed to book appointment. ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast.error('An error occurred while booking the appointment. Please try again.');
        } finally {
            dispatch(hideLoading());
        }
    };

    const renderTimeOptions = () => {
        if (!doctor || !doctor.timings || !doctor.timings[0]) return [];
        const { fromTime, toTime } = doctor.timings[0];
        const [fromHour, fromMinute] = parseTime(fromTime);
        const [toHour, toMinute] = parseTime(toTime);
        const options = [];
        
        for (let hour = fromHour; hour < toHour; hour++) {
            options.push(formatTime(hour, 0));
            options.push(formatTime(hour, 30));
        }
        
        if (toMinute > 0) {
            options.push(formatTime(toHour, 0));
        }

        return options;
    };

    const parseTime = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return [hours, minutes];
    };

    const formatTime = (hour, minute) => {
        const period = hour < 12 ? 'AM' : 'PM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute === 0 ? '00' : '30'} ${period}`;
    };

    return (
        <Layout>
            {doctor === null ? (
                <h1 className="text-center text-gray-800 text-2xl">Loading Professional data...</h1>
            ) : (
                <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6"><strong>{doctor.firstName} {doctor.lastName}</strong></h1>
                    <p className="text-3xl font-bold text-gray-800 mb-6"><strong>Service :</strong> {doctor.specialization}</p>
                    <p className="text-gray-600 mb-4"><strong>Email:</strong> {doctor.email}</p>
                    <p className="text-gray-600 mb-4"><strong>Phone Number:</strong> {doctor.phoneNumber}</p>
                    <p className="text-gray-600 mb-4"><strong>Experience:</strong> {doctor.experience} years</p>
                    <p className="text-gray-600 mb-6"><strong>Timings:</strong> {doctor.timings[0].fromTime} - {doctor.timings[0].toTime}</p>

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="appointmentDate" className="block text-gray-700 mb-2">Select Date:</label>
                            <input
                                type="date"
                                id="appointmentDate"
                                value={appointmentDate}
                                onChange={handleDateChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                        </div>
                        <div>
                            <label htmlFor="appointmentTime" className="block text-gray-700 mb-2">Select Time:</label>
                            <select
                                id="appointmentTime"
                                value={appointmentTime}
                                onChange={handleTimeChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                            >
                                <option value="">Select Time</option>
                                {renderTimeOptions().map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
                        >
                            Book Appointment
                        </button>
                    </form>
                </div>
            )}
        </Layout>
    );
};

export default Booking;
