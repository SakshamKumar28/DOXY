const express = require('express');
const router = express.Router();
const {
    createPrescription,
    getMyPrescriptions,
    getPrescriptionById
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Doctor'), createPrescription);

router.route('/my')
    .get(protect, getMyPrescriptions);

router.route('/:id')
    .get(protect, getPrescriptionById);

module.exports = router;
