const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find({}).select('-password');
    res.json(doctors);
});

// @desc    Get doctor profile (Private)
// @route   GET /api/doctors/profile
// @access  Private (Doctor)
const getDoctorProfile = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.user._id).select('-password');
    if (doctor) {
        res.json(doctor);
    } else {
        res.status(404);
        throw new Error('Doctor not found');
    }
});

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id).select('-password -reviews'); // Reviews can be populated optionally or fetched separately
    // Ideally we include reviews here or fetched lazily. Let's include them but maybe just the latest few?
    // For now simple find.
    
    // Re-fetch to include reviews properly if needed, but schema has them embedded.
    // The previous line excluded reviews just to be cautious. Let's include them for the detail view.
    const fullDoctor = await Doctor.findById(req.params.id).select('-password').populate('reviews.user', 'name');

    if (fullDoctor) {
        res.json(fullDoctor);
    } else {
        res.status(404);
        throw new Error('Doctor not found');
    }
});

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor)
const updateDoctorProfile = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.user._id);

    if (doctor) {
        doctor.name = req.body.name || doctor.name;
        doctor.email = req.body.email || doctor.email;
        doctor.specialization = req.body.specialization || doctor.specialization;
        doctor.experience = req.body.experience || doctor.experience;
        doctor.consultationFee = req.body.consultationFee || doctor.consultationFee;
        
        if (req.body.password) {
            doctor.password = req.body.password;
        }

        const updatedDoctor = await doctor.save();

        res.json({
            _id: updatedDoctor._id,
            name: updatedDoctor.name,
            email: updatedDoctor.email,
            role: 'Doctor',
            specialization: updatedDoctor.specialization
        });
    } else {
        res.status(404);
        throw new Error('Doctor not found');
    }
});

// @desc    Add/Update Availability
// @route   PUT /api/doctors/availability
// @access  Private (Doctor)
const updateAvailability = asyncHandler(async (req, res) => {
    // Expects availability array: [{ day: 'Monday', startTime: '10:00', endTime: '18:00' }]
    const doctor = await Doctor.findById(req.user._id);

    if (doctor) {
        doctor.availability = req.body.availability || doctor.availability;
        const updatedDoctor = await doctor.save();
        res.json(updatedDoctor.availability);
    } else {
        res.status(404);
        throw new Error('Doctor not found');
    }
});

// @desc    Add review for doctor
// @route   POST /api/doctors/:id/reviews
// @access  Private (Patient)
const createDoctorReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const doctor = await Doctor.findById(req.params.id);

    if (doctor) {
        const alreadyReviewed = doctor.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Doctor already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        };

        doctor.reviews.push(review);
        await doctor.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Doctor not found');
    }
});

module.exports = {
    getDoctors,
    getDoctorProfile,
    getDoctorById,
    updateDoctorProfile,
    updateAvailability,
    createDoctorReview
};
