const express = require('express');
const router = express.Router();
const {
    registerPatient,
    registerDoctor,
    loginUser,
    logoutUser
} = require('../controllers/authController');

router.post('/register-patient', registerPatient);
router.post('/register-doctor', registerDoctor);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;
