const express = require('express');
const router = express.Router();
const {
    getDoctors,
    getDoctorById,
    getDoctorProfile,
    updateDoctorProfile,
    updateAvailability,
    createDoctorReview
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getDoctors);


router.route('/profile')
    .get(protect, authorize('Doctor'), getDoctorProfile)
    .put(protect, authorize('Doctor'), updateDoctorProfile);

router.route('/availability')
    .put(protect, authorize('Doctor'), updateAvailability);

router.route('/:id')
    .get(getDoctorById);

router.route('/:id/reviews')
    .post(protect, authorize('Patient'), createDoctorReview);

module.exports = router;
