const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const createAppointment = asyncHandler(async (req, res) => {
    const { doctorId, date, time, type } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        res.status(404);
        throw new Error('Doctor not found');
    }

    // Construct datetime from separate date and time fields
    let datetime;
    if (date && time) {
        datetime = new Date(`${date}T${time}`);
    } else if (req.body.datetime) {
        datetime = new Date(req.body.datetime);
    } else {
        res.status(400);
        throw new Error('Date and Time are required');
    }

    const appointment = await Appointment.create({
        patient: req.user._id,
        doctor: doctorId,
        datetime,
        type: type || 'Video'
    });

    res.status(201).json(appointment);
});

// @desc    Get appointments for logged in user (Doctor or Patient)
// @route   GET /api/appointments
// @access  Private
// @desc    Get appointments for logged in user (Doctor or Patient)
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
    let appointments = [];

    // Ensure role is available (middleware should handle this, but double check)
    // Note: req.role comes from authMiddleware
    const role = req.role || req.user.role || 'patient'; 
    // Normalized comparison
    const normalizedRole = role.toLowerCase();

    if (normalizedRole === 'patient') {
        appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'name specialization')
            .sort({ datetime: -1 });
    } else if (normalizedRole === 'doctor') {
        appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'name age gender')
            .sort({ datetime: -1 });
    } else {
        // Fallback or empty if role is weird
        console.warn(`Unknown role in getAppointments: ${role}`);
    }

    // Transform data to ensure 'date' and 'time' fields exist for frontend
    const formattedAppointments = appointments.map(app => {
        const appObj = app.toObject();
        const dt = new Date(appObj.datetime);
        return {
            ...appObj,
            // Format date as YYYY-MM-DD for consistency
            date: dt.toISOString().split('T')[0],
            // Format time as HH:mm
            time: dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) // 24h format
        };
    });

    res.json(formattedAppointments);
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor/Patient)
const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    // Authorization check
    // Patient can Cancel. Doctor can Accept, Cancel, Complete, etc.
    if (req.role === 'Patient') {
        if (appointment.patient.toString() !== req.user._id.toString()) {
             res.status(401);
             throw new Error('Not authorized');
        }
        if (status !== 'Cancelled') {
             res.status(400);
             throw new Error('Patients can only cancel appointments');
        }
    } else if (req.role === 'Doctor') {
        if (appointment.doctor.toString() !== req.user._id.toString()) {
             res.status(401);
             throw new Error('Not authorized');
        }
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    res.json(updatedAppointment);
});

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointmentStatus
};
