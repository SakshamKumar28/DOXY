const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if user is a Patient
            let user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                // Check if user is a Doctor
                user = await Doctor.findById(decoded.userId).select('-password');
            }

            if (!user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            req.user = user;
            req.userRole = user instanceof mongoose.model('Doctor') ? 'Doctor' : 'Patient'; // Just a logical guess, ensuring we know the role. 
            // Better approach: Check collection name or schema. 
            // However, since we queried separately, we implicitly know.
            // Let's refine the query logic to be explicit.
            
            // Actually, we don't need instanceof check if we found it in specific collection.
            
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Since we have two collections, it is tricky to know which one `req.user` belongs to just by the object.
// We should attach the role to `req`.
// Let's rewrite the logic slightly to be cleaner.

const protectUniversal = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findById(decoded.userId).select('-password');
        let role = 'Patient';

        if (!user) {
            user = await Doctor.findById(decoded.userId).select('-password');
            role = 'Doctor';
        }

        if (!user) {
             res.status(401);
             throw new Error('Not authorized, user not found');
        }

        req.user = user;
        req.role = role;
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.role)) {
            res.status(403);
            throw new Error(`User role ${req.role} is not authorized to access this route`);
        }
        next();
    };
};

module.exports = { protect: protectUniversal, authorize };
