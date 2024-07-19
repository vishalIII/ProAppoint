const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel'); // Import the User model
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/book', authMiddleware, async (req, res) => {
    try {
        const { DoctoruserId, doctorId, date, time, doctorInfo, userInfo } = req.body;

        if (!doctorId || !date || !time) {
            return res.status(200).json({ success: false, message: 'Missing required fields' });
        }

        // Check if the user already has an appointment with the same doctor at the specified date and time
        const existingUserAppointment = await Appointment.findOne({ userId: req.body.userId, doctorId, date, time });
        if (existingUserAppointment) {
            return res.status(200).json({ success: false, message: 'You have already booked an appointment with this Professional at the selected time' });
        }

        // Check if the doctor is available at the specified date and time with status 'approved'
        const existingDoctorAppointment = await Appointment.findOne({ doctorId, date, time, status: 'approved' });
        if (existingDoctorAppointment) {
            return res.status(200).json({ success: false, message: 'Professional is not available at the selected time' });
        }

        const newAppointment = new Appointment({
            doctorId,
            userId: req.body.userId, // Auth middleware should have set this
            doctorInfo,
            userInfo,
            date,
            time,
            status: 'pending' // Default status is 'pending'
        });

        await newAppointment.save();

        // Send notification to the doctor
        const doctorUser = await User.findById(DoctoruserId);
        if (doctorUser) {
            doctorUser.unseenNotification.push({
                message: `New appointment request from ${userInfo.firstName} ${userInfo.lastName} on ${date} at ${time}`,
                appointmentId: newAppointment._id,
                date: new Date()
            });
            await doctorUser.save();
        }

        res.status(201).json({ success: true, message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


// Endpoint to fetch appointments for the logged-in user
router.get('/user/appointments', authMiddleware, async (req, res) => {
    try {
        const userId = req.body.userId; // Auth middleware should have set this
        const userAppointments = await Appointment.find({ userId });
        res.status(200).json({ success: true, data: userAppointments });
    } catch (error) {
        console.error('Error fetching user appointments:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to get doctor's appointments by doctorId
router.get('/doctor/appointments/:doctorId', authMiddleware, async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        const userAppointments = await Appointment.find({ doctorId });
        res.status(200).json({ success: true, data: userAppointments });

    } catch (error) {
        console.error('Error fetching Professional appointments:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


router.post('/accept', authMiddleware, async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        appointment.status = 'approved';
        await appointment.save();

        // Send notification to user
        const user = await User.findById(appointment.userId);
        if (user) {
            user.unseenNotification.push({
                message: `Your appointment with ${appointment.doctorInfo.firstName} ${appointment.doctorInfo.lastName} on ${appointment.date} at ${appointment.time} has been approved.`,
                appointmentId: appointment._id,
                date: new Date()
            });
            await user.save();
        }

        res.status(200).json({ success: true, message: 'Appointment approved' });
    } catch (error) {
        console.error('Error approving appointment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint to reject an appointment
router.post('/reject', authMiddleware, async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        appointment.status = 'rejected';
        await appointment.save();

        // Send notification to user
        const user = await User.findById(appointment.userId);
        if (user) {
            user.unseenNotification.push({
                message: `Your appointment with ${appointment.doctorInfo.firstName} ${appointment.doctorInfo.lastName} on ${appointment.date} at ${appointment.time} has been rejected.`,
                appointmentId: appointment._id,
                date: new Date()
            });
            await user.save();
        }

        res.status(200).json({ success: true, message: 'Appointment rejected' });
    } catch (error) {
        console.error('Error rejecting appointment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


module.exports = router;