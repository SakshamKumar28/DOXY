const asyncHandler = require('express-async-handler');
const Prescription = require('../models/Prescription');

// @desc    Create new prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
const createPrescription = asyncHandler(async (req, res) => {
    const { patientId, appointmentId, diagnosis, medicines, notes } = req.body;

    if (!patientId || !medicines || medicines.length === 0) {
        res.status(400);
        throw new Error('Please provide patient and medicines');
    }

    const prescription = await Prescription.create({
        doctor: req.user._id,
        patient: patientId,
        appointment: appointmentId,
        diagnosis,
        medicines,
        notes
    });

    res.status(201).json(prescription);
});

// @desc    Get prescriptions for logged in patient or doctor
// @route   GET /api/prescriptions/my
// @access  Private
const getMyPrescriptions = asyncHandler(async (req, res) => {
    let prescriptions = [];
    
    // Check role from auth middleware
    const role = req.role; 

    if (role === 'Patient') {
        prescriptions = await Prescription.find({ patient: req.user._id })
            .populate('doctor', 'name specialization')
            .sort({ date: -1 });
    } else if (role === 'Doctor') {
        prescriptions = await Prescription.find({ doctor: req.user._id })
            .populate('patient', 'name age')
            .sort({ date: -1 });
    }

    res.json(prescriptions);
});

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = asyncHandler(async (req, res) => {
    const prescription = await Prescription.findById(req.params.id)
        .populate('doctor', 'name specialization phone')
        .populate('patient', 'name age gender address');

    if (prescription) {
        // Authorization check
        if (req.user._id.toString() !== prescription.patient._id.toString() && 
            req.user._id.toString() !== prescription.doctor._id.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }
        res.json(prescription);
    } else {
        res.status(404);
        throw new Error('Prescription not found');
    }
});

module.exports = {
    createPrescription,
    getMyPrescriptions,
    getPrescriptionById
};
