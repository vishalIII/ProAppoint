const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Use uppercase for model names
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware')
const Doctor = require('../models/doctorModel')

// Register Route
router.post('/register', async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(200).send({ message: "User already exists", success: false });
        }

        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword
        });

        res.status(201).send({ message: 'User created successfully', success: true });
    } catch (error) {
        res.status(500).send({ message: "Error creating user", success: false, error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // No need to await req.body

        const isUser = await User.findOne({ email });
        if (!isUser) {
            return res.status(400).send({ message: "Sign up to login", success: false });
        }

        const isMatch = await bcrypt.compare(password, isUser.password);
        if (isMatch) {
            const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });
            return res.status(200).send({ message: "Login successfully", success: true, token : token });
        } else {
            return res.status(400).send({ message: "Email or password is wrong!", success: false });
        }
    } catch (error) {
        return res.status(500).send({ message: "Error while trying to login", success: false, error });
    }
});

// Get User Info By ID Route
router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
    // console.log("Request received"); // Log request
    // console.log()
    try {
        // console.log(await req.body)
        const user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(400).send({ message: "User does not exist", success: false });
        } else {
            res.status(200).send({ success: true, 
                data: {
                 name: user.name,
                 email: user.email ,
                 isAdmin:user.isAdmin,
                 isDoctor:user.isDoctor,
                 seenNotification:user.seenNotification,
                 unseenNotification:user.unseenNotification,
                } 
            });
        }
    } catch (error) {
        console.error('Error getting user info:', error); 
        res.status(500).send({ message: "Error getting user info", success: false, error });
    }
});

// apply for doctor
router.post('/apply-doctor-account', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        }

        // Check if the user has already applied for a doctor account
        const existingDoctorApplication = await Doctor.findOne({ userId: req.body.userId });
        if (existingDoctorApplication) {
            return res.status(200).send({ message: 'You have already applied for a Professional account', success: false });
        }

        const newDoctor = new Doctor({
            userId: req.body.userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            website: req.body.website,
            address: req.body.address,
            specialization: req.body.specialization,
            experience: req.body.experience,
            feePerConsultation: req.body.feePerConsultation,
            Timings: [req.body.fromTime, req.body.toTime]
        });

        await newDoctor.save();

        const adminUser = await User.findOne({ isAdmin: true });
        if (!adminUser) {
            return res.status(400).send({ message: 'Admin user not found', success: false });
        }

        const unseenNotification = adminUser.unseenNotification || [];
        unseenNotification.push({
            type: "new-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Professional account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + ' ' + newDoctor.lastName
            },
            onclickPath: '/admin/doctors'
        });

        await User.findByIdAndUpdate(adminUser._id, { unseenNotification });

        res.status(200).send({
            success: true,
            message: 'Professional account applied successfully'
        });
    } catch (error) {
        console.error('Error applying Professional account:', error);
        res.status(500).send({ message: "Error applying Professional account", success: false, error });
    }
});


router.post('/mark-all-as-seen', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.seenNotification = user.unseenNotification;
        user.unseenNotification = [];
        const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true }).select('-password');

        res.status(200).send({
            success: true,
            message: 'All notifications marked as seen',
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error marking notifications as seen", success: false, error });
    }
});

router.post('/remove-all-seen', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.seenNotification = [];

        const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true }).select('-password');

        res.status(200).send({
            success: true,
            message: 'All seen notifications removed',
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error removing seen notifications", success: false, error });
    }
});

router.post('/get-all-approved-doctors', authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: 'approved' });

        res.status(200).send({
            success: true,
            message: 'Approved Professionals fetched successfully',
            data: doctors,
        });
    } catch (error) {
        console.error('Error getting approved Professionals:', error);
        res.status(500).send({ message: 'Error getting approved Professionals', success: false, error });
    }
});


module.exports = router;