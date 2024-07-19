const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctorModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Get doctor info by user ID
router.post('/get-doctor-info-by-user-id', authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: 'Professional info fetched successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Error getting Professional info:', error);
    res.status(500).send({ message: 'Error getting doctor info', success: false, error });
  }
});

router.post('/get-doctor-info-id', authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: 'Professional info fetched successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Error getting doctor info:', error);
    res.status(500).send({ message: 'Error getting Professional info', success: false, error });
  }
});
// Update doctor info
router.put('/update-doctor-info', authMiddleware, async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: 'Professional info updated successfully',
      data: updatedDoctor,
    });
  } catch (error) {
    console.error('Error updating Professional info:', error);
    res.status(500).send({ message: 'Error updating Professional info', success: false, error });
  }
});

module.exports = router;
