const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAppointments,
    updateAppointmentStatus
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Patient'), createAppointment)
    .get(protect, getAppointments);

router.route('/:id/status')
    .put(protect, updateAppointmentStatus);

module.exports = router;
