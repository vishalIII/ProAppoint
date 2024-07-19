const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Use uppercase for model names
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware')
const Doctor = require('../models/doctorModel')

// Register Route

// -------------------------
router.get('/get-all-users', authMiddleware, async (req, res) => {
    // console.log("Request received"); // Log request
    // console.log()
    try {
        // console.log(await req.body)
        const users = await User.find({})
        res.status(200).send({
             message: "Users fetched successfully",
             success : true,
             data : users,
        });
    } catch (error) {
        console.error(error); 
        res.status(500).send({ message: "Error getting user info", success: false, error });
    }
});

// -------------------------
router.get('/get-all-doctors', authMiddleware, async (req, res) => {
    // console.log("Request received"); // Log request
    // console.log()
    try {
        // console.log(await req.body)
        const doctors = await Doctor.find({})
        res.status(200).send({
             message: "Users fetched successfully",
             success : true,
             data : doctors,
        });
    } catch (error) {
        console.error(error); 
        res.status(500).send({ message: "Error getting user info", success: false, error });
    }
});

router.post('/change-doctor-status', authMiddleware, async (req, res) => {
    try {
        const { doctorId, status, userId } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(doctorId, { status }, { new: true });

        if (!doctor) {
            return res.status(404).send({
                message: "Professional not found",
                success: false,
            });
        }

        const user = await User.findById({_id:doctor.userId});
        if (!user) {
            return res.status(404).send({
                message: "User not found",
                success: false,
            });
        }
        user.isDoctor= status ==='approved'?true:false
        const unseenNotification = user.unseenNotification || [];
        unseenNotification.push({
            type: "doctor-status-changed",
            message: `Your Professional account status has been changed to ${status}`,
            onclickPath: '/notification',
        });
        user.unseenNotification = unseenNotification;
        await user.save();

        res.status(200).send({
            message: "Professional status updated successfully",
            success: true,
            data: doctor,
        });
    } catch (error) {
        console.error(error); 
        res.status(500).send({ message: "Error updating Professional status", success: false, error });
    }
});

module.exports = router;