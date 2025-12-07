const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const generateToken = require('../utils/generateToken');

// @desc    Register a new patient
// @route   POST /api/auth/register-patient
// @access  Public
const registerPatient = asyncHandler(async (req, res) => {
    const { name, email, password, age, gender, address } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        age,
        gender,
        address
    });

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: 'Patient'
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Register a new doctor
// @route   POST /api/auth/register-doctor
// @access  Public
const registerDoctor = asyncHandler(async (req, res) => {
    const { name, email, password, specialization, experience, consultationFee } = req.body;

    const doctorExists = await Doctor.findOne({ email });

    if (doctorExists) {
        res.status(400);
        throw new Error('Doctor already exists');
    }

    const doctor = await Doctor.create({
        name,
        email,
        password,
        specialization,
        experience,
        consultationFee
    });

    if (doctor) {
        generateToken(res, doctor._id);
        res.status(201).json({
            _id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            role: 'Doctor'
        });
    } else {
        res.status(400);
        throw new Error('Invalid doctor data');
    }
});

// @desc    Auth user & get token (Login for both)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, role: requestedRole } = req.body;

    let user;
    let role = 'Patient';

    if (requestedRole === 'doctor') {
        user = await Doctor.findOne({ email }).select('+password');
        role = 'Doctor';
        // If not found in Doctor, but they might be a patient trying to login? 
        // No, strict login based on tab selection is better for this multi-role app.
        if (!user) {
             res.status(401);
             throw new Error('Doctor account not found');
        }
    } else if (requestedRole === 'patient') {
        user = await User.findOne({ email }).select('+password');
        role = 'Patient';
        if (!user) {
             res.status(401);
             throw new Error('Patient account not found');
        }
    } else {
        // Fallback for generic login (if role not provided)
        user = await User.findOne({ email }).select('+password');
        if (!user) {
            user = await Doctor.findOne({ email }).select('+password');
            role = 'Doctor';
        }
    }

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: role
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV !== 'development',
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none'
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = {
    registerPatient,
    registerDoctor,
    loginUser,
    logoutUser
};
